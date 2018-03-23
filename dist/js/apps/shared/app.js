'use strict';

(function (app, bootstrapCollapseHelper) {
	'use strict';

	var EventsPageCtrl = function EventsPageCtrl($document, $scope, $timeout, $animate, $location, $window, CONSTANTS, eventsService, filterHelperService, metaService, RequestModel) {
		var vm = this;
		var filterTypes = ['locations', 'eventTypes', 'ageGroups'];

		var getStartDateLocaleString = function getStartDateLocaleString() {
			return $window.moment().format();
		};
		var getEndDateLocaleString = function getEndDateLocaleString() {
			return $window.moment().add(30, 'd').format();
		};

		/**
         * This contains the state of the filters on the page, this should match the most recent request, and results should be
         * visible on the page
         */
		vm.requestModel = new RequestModel();

		var eventDateBarStickySettings = {
			zIndex: 100,
			responsiveWidth: true
		};

		/* ** Public ** */
		vm.eventGroups = [];
		vm.keywords = '';
		vm.chunkSize = CONSTANTS.requestChunkSize;
		vm.totalResults = 0;
		vm.isLastPage = false;
		vm.areDatesInvalid = false;
		vm.isLoading = true;
		vm.hasResults = true;
		vm.data = {};

		vm.locations = [];
		vm.eventsTypes = [];
		vm.ageGroups = [];

		var getFilterPanelStatus = function getFilterPanelStatus(model) {
			var activePanels = [];
			var inActivePanels = [];
			if (model.Locations.length) {
				activePanels.push('locations');
			} else {
				inActivePanels.push('locations');
			}
			if (model.EventsTypes.length) {
				activePanels.push('eventTypes');
			} else {
				inActivePanels.push('eventTypes');
			}
			if (model.AgeGroups.length) {
				activePanels.push('ageGroups');
			} else {
				inActivePanels.push('ageGroups');
			}
			return {
				activePanels: activePanels,
				inActivePanels: inActivePanels
			};
		};

		vm.filterEvents = function (eventRequestModel, isInit, callback) {
			// Clear out existing list of events
			vm.eventGroups = [];

			// Let user know we are retreiving a new list of events
			vm.isLoading = true;
			vm.hasResults = true; // Do this to make sure the user doesn't see the no results message it will be updated below
			vm.requestErrorMessage = '';
			vm.requestModel = eventRequestModel;

			var startDatePicker = angular.element('#start-date')[0]._flatpickr; // eslint-disable-line 
			var endDatePicker = angular.element('#end-date')[0]._flatpickr; // eslint-disable-line 

			$document.ready(function () {
				startDatePicker.setDate($window.moment(eventRequestModel.StartDate).toDate());
				endDatePicker.setDate($window.moment(eventRequestModel.EndDate).toDate());
				vm.userStartDate = $window.moment(eventRequestModel.StartDate).format('MMMM DD, YYYY');
				vm.userEndDate = $window.moment(eventRequestModel.EndDate).format('MMMM DD, YYYY');
			});

			eventsService.get(eventRequestModel).then(function (events) {
				processEvents(events);

				vm.hasResults = !!getTotalResults(events);

				var filterPanelStatuses = getFilterPanelStatus(eventRequestModel);

				if (isInit) {
					bootstrapCollapseHelper.toggleCollapseByIds(filterPanelStatuses);
				}

				if (callback && typeof callback === 'function') {
					callback(events);
				}
			}).catch(handleFailedEventsGetRequest);
		};

		/** HELPERS */
		var getTotalResults = function getTotalResults(events) {
			return events && Object.prototype.hasOwnProperty.call(events, 'totalResults') ? events.totalResults : 0;
		};

		/** FILTER STUFF */
		vm.keywordSearch = function () {
			var newRequestModel = Object.assign({}, vm.requestModel);

			newRequestModel.Keyword = vm.keywords;
			newRequestModel.Page = 1;

			filterHelperService.setQueryParams([{
				key: 'term',
				val: vm.keywords
			}]); // This will trigger a location change, therefore getting the new results
		};

		vm.filterByDate = function () {
			vm.areDatesInvalid = !isDateRangeValid(vm.userStartDate, vm.userEndDate);

			if (!vm.areDatesInvalid) {
				var newRequestModel = Object.assign({}, vm.requestModel);

				newRequestModel.StartDate = vm.userStartDate;
				newRequestModel.EndDate = vm.userEndDate;
				newRequestModel.Page = 1;

				filterHelperService.setQueryParams([{
					key: 'startDate',
					val: vm.userStartDate
				}, {
					key: 'endDate',
					val: vm.userEndDate
				}]); // This will trigger a location change, therefore getting the new results
			}
		};

		vm.clearFilters = function () {
			resetRequestModel();

			resetUIFilterFields();

			filterHelperService.clearQueryParams();

			vm.filterEvents(vm.requestModel);
		};

		vm.loadNextPage = function () {
			var newRequestModel = Object.assign({}, vm.requestModel);
			newRequestModel.Page += 1;

			vm.requestModel = newRequestModel;

			// TODO: Realistically this should add a url here, too
			eventsService.get(newRequestModel).then(processAndCombineEvents).then(function () {
				$timeout(function () {
					$('.event-date-bar').sticky(eventDateBarStickySettings);
				});
			});
		};

		var setFilterData = function setFilterData(key, values) {
			if (!Object.prototype.hasOwnProperty.call(vm.data, key)) {
				// Only set this one time
				vm.data[key] = values;
			}
		};

		vm.filterByTerms = function (id, itemType, isChecked, filterVal) {
			var shouldUpdateLocation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

			var newRequestModel = Object.assign({}, vm.requestModel);

			switch (itemType.toLowerCase()) {
				case 'locations':
					toggleFilter(newRequestModel.Locations, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				case 'agegroups':
					toggleFilter(newRequestModel.AgeGroups, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				case 'eventtypes':
					toggleFilter(newRequestModel.EventsTypes, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				default:
					break;
			}

			vm.filterEvents(newRequestModel);
		};

		var handleFailedEventsGetRequest = function handleFailedEventsGetRequest() {
			vm.isLoading = false;
			vm.requestErrorMessage = 'There was a problem retrieving events. Please try again later.';
		};

		var toggleFilter = function toggleFilter(collection, id, shouldAddToCollection, filterKey, filterVal, shouldUpdateLocation) {
			if (shouldAddToCollection) {
				collection.push(id);
			} else {
				var indexOfId = collection.indexOf(id);

				if (indexOfId !== -1) {
					collection.splice(indexOfId, 1);
				}
			}

			if (shouldUpdateLocation) {
				filterHelperService.updateQueryParams([{
					key: filterKey,
					val: filterVal
				}]);
			}
		};

		var resetRequestModel = function resetRequestModel() {
			vm.requestModel = new RequestModel();
		};

		var resetUIFilterFields = function resetUIFilterFields() {
			vm.keywords = '';
			vm.userStartDate = '';
			vm.userEndDate = '';
		};

		/* ** Private ** */

		// GOOD
		var processEvents = function processEvents(eventResults) {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = eventResults.eventGroups;
			vm.isLoading = false;
			vm.hasResults = eventResults.eventGroups.length;
			vm.requestErrorMessage = '';

			$timeout(function () {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			});
		};

		// GOOD
		var processAndCombineEvents = function processAndCombineEvents(eventResults) {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = combineEventGroups(vm.eventGroups, eventResults.eventGroups);
		};

		// GOOD
		var isLastPage = function isLastPage(totalResults) {
			var totalResultsSoFar = vm.requestModel.Page * vm.chunkSize;
			return totalResultsSoFar >= totalResults;
		};

		// GOOD
		var isDateRangeValid = function isDateRangeValid(firstDate, secondDate) {
			if (firstDate && secondDate) {
				return $window.moment(firstDate).isSameOrBefore(secondDate);
			}
			return false;
		};

		// GOOD
		var isSameDay = function isSameDay(day1Date, day2Date) {
			return day1Date && day2Date ? $window.moment(day1Date).isSame(day2Date, 'day') : false;
		};

		// GOOD
		var combineEventGroups = function combineEventGroups(oldEventGroups, newEventGroups) {
			var renderedEventGroups = oldEventGroups;
			var lastEventGroup = renderedEventGroups[renderedEventGroups.length - 1];

			angular.forEach(newEventGroups, function (eventGroup) {
				if (isSameDay(lastEventGroup.date, eventGroup.date)) {
					lastEventGroup.events = lastEventGroup.events.concat(eventGroup.events);
				} else {
					renderedEventGroups.push(eventGroup);
				}
			});

			return renderedEventGroups;
		};

		// GOOD
		var toggleIcon = function toggleIcon(collapseEvent) {
			var $collapsible = angular.element(collapseEvent.currentTarget);
			var $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		// GOOD
		var getKeywords = function getKeywords() {
			return $location.search().term && $location.search().term.length ? $location.search().term : '';
		};

		/* ** Init ** */
		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		var getFilterId = function getFilterId(filterType, val) {
			if (!val) return -1;

			var filterTypeExists = Object.prototype.hasOwnProperty.call(vm.data, filterType);

			if (filterTypeExists) {
				var matchedFilters = vm.data[filterType].filter(function (filter) {
					return Object.prototype.hasOwnProperty.call(filter, 'Name') && filter.Name.toLowerCase().trim() === val.toLowerCase().trim();
				});

				if (filterType === 'locations') {
					return matchedFilters.length ? matchedFilters[0].LocationId : null;
				}
				return matchedFilters.length ? matchedFilters[0].Id : null;
			}

			return -1;
		};

		var isEmptyObject = function isEmptyObject(obj) {
			return Object.keys(obj).length === 0 && obj.constructor === Object;
		};
		var isFilterADate = function isFilterADate(filterType) {
			return filterType && filterType.toLowerCase().indexOf('date') > -1;
		};
		var upperCaseFirstLetter = function upperCaseFirstLetter(word) {
			return word.replace(/^\w/, function (chr) {
				return chr.toUpperCase();
			});
		};

		var getRequestModelBasedOnQueryParams = function getRequestModelBasedOnQueryParams() {
			var newRequestModel = Object.assign({}, vm.requestModel);
			var queryParams = filterHelperService.getQueryParams();

			if (isEmptyObject(queryParams)) {
				resetUIFilterFields();
				return vm.requestModel;
			}

			// Build the request model

			// Keywords
			var keywords = getKeywords();
			newRequestModel.Keyword = keywords;
			vm.keywords = keywords;

			// Dates
			var requestDates = getDatesFromUrl(queryParams);

			if (requestDates) {
				newRequestModel.StartDate = requestDates.startDate;
				newRequestModel.EndDate = requestDates.endDate;
			}

			// Lists
			var queryParamKeys = Object.keys(queryParams);

			queryParamKeys.forEach(function (filterType) {
				var isFilterTypeDate = isFilterADate(filterType);

				if (!isFilterTypeDate) {
					var filterValStr = queryParams[filterType];
					var filterValues = filterHelperService.getFiltersFromString(filterValStr);

					filterValues.forEach(function (filterVal) {
						var filterId = getFilterId(filterType, filterVal);

						if (filterId && filterId > -1) {
							var requestModelKey = upperCaseFirstLetter(filterType);

							if (requestModelKey.indexOf('EventTypes') > -1) {
								requestModelKey = 'EventsTypes';
							}

							newRequestModel[requestModelKey] = getFilterArray(newRequestModel[requestModelKey], filterId);
						}
					});
				}
			});

			return newRequestModel;
		};

		var getFilterArray = function getFilterArray(targetFilterArray, targetVal) {
			var newArray = targetFilterArray ? targetFilterArray.slice() : [];
			var doesTargetValueExist = targetFilterArray && targetFilterArray.length && targetFilterArray.includes(targetVal);

			if (doesTargetValueExist) {
				newArray = targetFilterArray.filter(function (x) {
					return x !== targetVal;
				});
			} else {
				newArray.push(targetVal);
			}

			return newArray;
		};

		var filterDataSuccessHandler = function filterDataSuccessHandler(data, filterType, callback) {
			setFilterData(filterType, data);

			if (callback && typeof callback === 'function') {
				callback();
			}
		};

		var filterDataErrorHandler = function filterDataErrorHandler(error, callback) {
			if (callback && typeof callback === 'function') {
				callback(error);
			}
		};

		// We need to load these on the page first, so that we can use that data
		var setupListFilters = function setupListFilters(successCallback, errorCallback) {
			var url = void 0;
			var counter = 0;

			filterTypes.forEach(function (filterType) {
				if (CONSTANTS.remoteServiceUrls[filterType]) {
					url = CONSTANTS.remoteServiceUrls[filterType];
				} else if (CONSTANTS.serviceUrls[filterType]) {
					url = '' + CONSTANTS.baseUrl + CONSTANTS.serviceUrls[filterType];
				}

				metaService.request(url).then(function (data) {
					return filterDataSuccessHandler(data, filterType, function () {
						counter += 1;

						if (counter === filterTypes.length) {
							successCallback();
						}
					});
				}, function (error) {
					return filterDataErrorHandler(error, errorCallback);
				});
			});
		};

		var getDatesFromUrl = function getDatesFromUrl(queryParams) {
			var userStartDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'startDate', true);
			var userEndDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'endDate', true);

			if (userStartDate || userEndDate) {
				vm.userStartDate = userStartDate;
				vm.userEndDate = userEndDate;

				return {
					startDate: userStartDate || getStartDateLocaleString(),
					endDate: userEndDate || getEndDateLocaleString()
				};
			}
			return null;
		};

		var updateResultsBasedOnFilters = function updateResultsBasedOnFilters(isInit) {
			var newRequestModel = getRequestModelBasedOnQueryParams();

			vm.filterEvents(newRequestModel, isInit);
		};

		var initErrorCallback = function initErrorCallback() {
			return eventsService.get(vm.requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
		};

		var init = function init() {
			// setupListFilters sets the data to the view model
			setupListFilters(function () {
				updateResultsBasedOnFilters(true);
			}, initErrorCallback);
		};

		$scope.$on('$locationChangeSuccess', function () {
			resetRequestModel();

			updateResultsBasedOnFilters();
		});

		init();
	};

	EventsPageCtrl.$inject = ['$document', '$scope', '$timeout', '$animate', '$location', '$window', 'events.CONSTANTS', 'dataServices.eventsService', 'sharedFilters.filterHelperService', 'metaService', 'RequestModel'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'), bcpl.boostrapCollapseHelper);
'use strict';

namespacer('bcpl');

// requires bootstrap.js to be included in the page
bcpl.boostrapCollapseHelper = function ($) {
	var toggleCollapseByIds = function toggleCollapseByIds(panels) {
		var activePanels = panels.activePanels,
		    inActivePanels = panels.inActivePanels;


		activePanels.forEach(function (id) {
			$('#' + id).collapse('show');
		});

		inActivePanels.forEach(function (id) {
			$('#' + id).collapse('hide');
		});
	};

	return {
		toggleCollapseByIds: toggleCollapseByIds
	};
}(jQuery);