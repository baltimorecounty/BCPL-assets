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
"use strict";

(function () {
  "use strict";

  angular.module("filterPageApp", ["ngAnimate"]).config(function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
})();
'use strict';

(function (app) {
	'use strict';

	var constants = {
		templates: {
			databases: '/js/apps/filter-page/templates/card-databases.html',
			locations: '/js/apps/filter-page/templates/card-locations.html'
		},
		urls: {
			// databases: 'http://ba224964:3100/api/structured-content/databases',
			databases: 'https://testservices.bcpl.info/api/structured-content/databases',
			locations: '/sebin/q/r/branch-amenities.json'
		},
		filters: {
			tags: {
				types: {
					pickOne: 'one',
					pickMany: 'many'
				}
			}
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var cardVisibilityFilter = function cardVisibilityFilter() {
		return function (cards, activeFilters) {
			var filtered = [];

			angular.forEach(cards, function (card) {
				var matches = 0;

				angular.forEach(card.Tags, function (tag) {
					if (activeFilters.indexOf(tag.Tag) !== -1) {
						matches += 1;
					}
				});

				if (matches === activeFilters.length) {
					filtered.push(card);
				}
			});

			return filtered;
		};
	};

	cardVisibilityFilter.$inject = [];

	app.filter('cardVisibilityFilter', cardVisibilityFilter);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var databasesService = function databasesService(CONSTANTS) {
		var get = function get(successCallback, errorCallback) {
			$.ajax(CONSTANTS.urls.databases).done(successCallback).fail(errorCallback);
		};

		return {
			get: get
		};
	};

	databasesService.$inject = ['CONSTANTS'];

	app.factory('databasesService', databasesService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var locationsService = function locationsService(CONSTANTS) {
		var get = function get(externalSuccessCallback, externalErrorCallback) {
			$.ajax(CONSTANTS.urls.locations).done(function (data) {
				internalSuccessCallback(data, externalSuccessCallback);
			}).fail(externalErrorCallback);
		};

		var internalSuccessCallback = function internalSuccessCallback(data, externalSuccessCallback) {
			var parsedData = typeof data === 'string' ? JSON.parse(data) : data;

			externalSuccessCallback(parsedData);
		};

		return {
			get: get
		};
	};

	locationsService.$inject = ['CONSTANTS'];

	app.factory('locationsService', locationsService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var cardService = function cardService($location, $window, $injector) {
		var get = function get(afterDataLoadedCallback, filterType) {
			var dataService = $injector.get(filterType + 'Service');

			dataService.get(function (data) {
				var sortedData = _.sortBy(data, function (dataItem) {
					return dataItem.Title;
				});
				afterDataLoadedCallback(sortedData);
			});
		};

		return {
			get: get
		};
	};

	cardService.$inject = ['$location', '$window', '$injector'];

	app.factory('cardService', cardService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var filterService = function filterService() {
		var getAllTagInfo = function getAllTagInfo(dataWithTags) {
			var tags = [];

			angular.forEach(dataWithTags, function (dataItem) {
				tags = tags.concat(dataItem.Tags);
			});

			return tags;
		};

		var getFamilies = function getFamilies(tagInfoArr) {
			return _.uniq(_.pluck(tagInfoArr, 'Name'), function (name) {
				return name;
			});
		};

		var getFamilyTags = function getFamilyTags(familyName, tagInfoArr) {
			var familyTagInfo = _.where(tagInfoArr, { Name: familyName });
			return _.uniq(_.sortBy(_.pluck(familyTagInfo, 'Tag'), function (tag) {
				return tag;
			}), function (tag) {
				return tag;
			});
		};

		var getFamilyType = function getFamilyType(familyName, tagInfoArr) {
			var familyType = _.findWhere(tagInfoArr, { Name: familyName });
			return familyType ? familyType.Type : 'none';
		};

		var build = function build(cardData) {
			var filterData = [];

			var tagInfoArr = getAllTagInfo(cardData);
			var families = getFamilies(tagInfoArr);

			angular.forEach(families, function (family) {
				filterData.push({
					name: family,
					tags: getFamilyTags(family, tagInfoArr),
					type: getFamilyType(family, tagInfoArr)
				});
			});

			return filterData;
		};

		var transformAttributesToTags = function transformAttributesToTags(cardData) {
			var taggedCardData = [];

			angular.forEach(cardData, function (cardDataItem) {
				var cardDataItemWithTags = angular.extend(cardDataItem, { Tags: [] });

				angular.forEach(cardDataItem.attributes, function (attribute) {
					var attributeList = attribute.split('|');

					if (attributeList.length !== 3) console.error('The attribute was not specified, this must be fixed.');

					var tag = {
						Name: attributeList[0] || 'none',
						Tag: attributeList[1],
						Type: attributeList[2] || 'Many'
					};

					cardDataItemWithTags.Tags.push(tag);
				});

				taggedCardData.push(cardDataItemWithTags);
			});

			return taggedCardData;
		};

		return {
			build: build,
			transformAttributesToTags: transformAttributesToTags
		};
	};

	app.factory('filterService', filterService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var FilterPageCtrl = function FilterPageCtrl($scope, $document, $window, cardService, filterService, $animate, $timeout, CONSTANTS) {
		var vm = this;

		vm.activeFilters = [];
		vm.allCardData = {};
		vm.isEverythingFilteredOut = false;

		/**
   * Makes sure the filters and tags are in sync.
   *
   * @param {string} filter
   */
		vm.setFilter = function (filter, filterFamily) {
			setActiveFilters(filter, filterFamily);
			cycleDisplay();
			publishLoadedCardsEvent();
		};

		vm.clearFilters = function () {
			vm.activeFilters = [];
			cycleDisplay();
			publishLoadedCardsEvent();
		};

		vm.setFilterType = function (filterType) {
			vm.filterType = filterType;
		};

		/* Private */

		var cycleDisplay = function cycleDisplay() {
			var resultsDisplayElement = document.getElementById('results-display');
			$animate.addClass(resultsDisplayElement, 'fade-out');
			vm.items = vm.allCardData.filter(filterDataItems);
			angular.element(resultsDisplayElement).trigger('bcpl.filter.changed', { items: vm.items });
			bcpl.utility.windowShade.cycle(250, 2000);
			$timeout(function () {
				$animate.removeClass(resultsDisplayElement, 'fade-out');
			}, 250);
		};

		var cardsLoadedEvent = typeof Event === 'function' ? new $window.Event('bc-filter-cards-loaded') : undefined;

		var publishLoadedCardsEvent = function publishLoadedCardsEvent() {
			if (cardsLoadedEvent) {
				document.dispatchEvent(cardsLoadedEvent);
			} else {
				angular.element(document).trigger('bc-filter-cards-loaded');
			}
		};

		/**
   * Loads up the list of filters and all of the branch data.
   *
   * @param {[string]} filters
   * @param {[*]} branchData
   */
		var loadCardsAndFilters = function loadCardsAndFilters(cardData) {
			if (!cardData.length) {
				return;
			}

			var taggedCardData = Object.prototype.hasOwnProperty.call(cardData[0], 'Tags') ? cardData : filterService.transformAttributesToTags(cardData);

			vm.filters = filterService.build(taggedCardData);
			vm.allCardData = taggedCardData;
			vm.items = taggedCardData;
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: vm.items });

			publishLoadedCardsEvent();
			$scope.$apply();
		};

		/**
   * Allows for multiple-filter matches by verifying an active branch has
   * "all" active filters, and not just "any" active filters.
   *
   * @param {*} dataItem
   */
		var filterDataItems = function filterDataItems(cardDataItem) {
			var matchCount = 0;

			if (!cardDataItem) return false;

			var tags = _.pluck(cardDataItem.Tags, 'Tag');

			angular.forEach(vm.activeFilters, function (activeFilter) {
				if (tags.indexOf(activeFilter) !== -1) {
					matchCount += 1;
				}
			});

			return matchCount === vm.activeFilters.length;
		};

		/**
   * Toggles filters in the master filter list since there are multiple
   * ways of setting a filter (tags or filter list).
   *
   * @param {*} filter
   */
		var setActiveFilters = function setActiveFilters(filter, filterFamily) {
			var isTagInfo = Object.prototype.hasOwnProperty.call(filter, 'Tag');
			var tagString = isTagInfo ? filter.Tag : filter;
			var filterIndex = vm.activeFilters.indexOf(tagString);
			var shouldAddFilter = filterIndex === -1;
			var foundFilterFamily = filterFamily;

			if (isTagInfo) {
				foundFilterFamily = _.where(vm.filters, { name: filter.Name });
				if (foundFilterFamily.length === 1) {
					foundFilterFamily = foundFilterFamily[0];
				}
			}

			var isPickOne = foundFilterFamily.type ? foundFilterFamily.type.toLowerCase() === CONSTANTS.filters.tags.types.pickOne : false;

			var tagsToRemove = [];

			if (shouldAddFilter && isPickOne) {
				angular.forEach(foundFilterFamily.tags, function (tag) {
					if (tag !== tagString) {
						tagsToRemove.push(tag);
					}
				});
			}

			angular.forEach(tagsToRemove, function (tagToRemove) {
				var isFound = vm.activeFilters.indexOf(tagToRemove) !== -1;

				if (isFound) {
					vm.activeFilters.splice(vm.activeFilters.indexOf(tagToRemove), 1);
				}
			});

			if (shouldAddFilter) {
				vm.activeFilters.push(tagString);
			} else {
				vm.activeFilters.splice(filterIndex, 1);
			}
		};

		var toggleIcon = function toggleIcon(collapseEvent) {
			var $collapsible = angular.element(collapseEvent.currentTarget);
			var $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		/* init */
		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		$document.ready(function () {
			if (vm.filterType && typeof vm.filterType === 'string') {
				cardService.get(loadCardsAndFilters, vm.filterType);
			}
		});

	};

	FilterPageCtrl.$inject = ['$scope', '$document', '$window', 'cardService', 'filterService', '$animate', '$timeout', 'CONSTANTS'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var cardDirective = function cardDirective($compile, $injector, $templateRequest, CONSTANTS) {
		var cardLink = function cardLink($scope, element, attrs) {
			$templateRequest(CONSTANTS.templates[attrs.template]).then(function (html) {
				element.append($compile(html)($scope));
			});
		};

		var directive = {
			restrict: 'E',
			scope: {
				filterHandler: '=',
				cardData: '=',
				activeFilters: '=',
				template: '='
			},
			template: '',
			link: cardLink
		};

		return directive;
	};

	cardDirective.$inject = ['$compile', '$injector', '$templateRequest', 'CONSTANTS'];

	app.directive('card', cardDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filterDirective = function filterDirective() {
		var filterLink = function filterLink($scope, filterElement) {
			var $filterElement = angular.element(filterElement);
			var $input = $filterElement.find('input');
			var inputType = $scope.filterFamily.type.trim().toLowerCase() === 'many' ? 'checkbox' : 'radio';
			$input.prop('type', inputType);

			if (inputType === 'radio') {
				$input.prop('name', $scope.filterFamily.name);
			}

			$scope.toggleFilter = function (activeFilter) {
				$scope.isFilterChecked = $filterElement.has(':checked').length > 0;
				$scope.filterHandler(activeFilter, $scope.filterFamily);
			};
		};

		var directive = {
			scope: {
				tag: '=',
				activeFilters: '=',
				filterHandler: '=',
				filterFamily: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/filter.html',
			link: filterLink
		};

		return directive;
	};

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective() {
		var filterLink = function filterLink($scope) {
			var findFilterMatch = function findFilterMatch(tagName, filter) {
				return tagName.toLowerCase() === filter.toLowerCase();
			};

			$scope.$watch('filterData', function () {
				$scope.filterFamilies = $scope.filterData ? $scope.filterData.map(addFilterId) : $scope.filterFamilies;

				if ($scope.filterFamilies && $scope.filterFamilies.length) {
					$scope.filterFamilies.forEach(function (filterFamily) {
						if (!filterFamily) return;

						var filterFamilyHasTags = Object.hasOwnProperty.call(filterFamily, 'tags') && filterFamily.tags.length;

						var tags = filterFamilyHasTags ? filterFamily.tags : [];
						var hasMatch = false;

						$scope.activeFilters.forEach(function (filter) {
							if (!hasMatch) {
								hasMatch = !!tags.filter(function (tagName) {
									return findFilterMatch(tagName, filter);
								}).length;
							}
						});

						// This should probably be refactored to be immutable
						filterFamily.isFilterActive = hasMatch; // eslint-disable-line no-param-reassign
					});
				}
			});

			var addFilterId = function addFilterId(filterFamily) {
				var newFamily = filterFamily;

				if (newFamily) {
					newFamily.name = newFamily.name === 'none' ? $scope.familyNameOverride : newFamily.name;
					newFamily.filterId = newFamily.name.replace(/[^\w]/g, '-');
				}

				return newFamily;
			};
		};

		var directive = {
			scope: {
				familyNameOverride: '@',
				isInitiallyExpanded: '@',
				filterHandler: '=',
				filterData: '=',
				activeFilters: '=',
				clearFilterFn: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/filters.html',
			link: filterLink
		};

		return directive;
	};

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var tagDirective = function tagDirective() {
		var tagLink = function filterLink($scope) {
			$scope.toggleFilter = function (activeFilter) {
				var activeTags = $scope.tagData.Tags.filter(function (tagInfo) {
					return tagInfo.Tag === activeFilter.Tag;
				});

				if (activeTags.length) {
					// One tag will only have one family, so unwrap it.
					$scope.filterHandler(activeFilter, activeTags[0]);
				}
			};
		};

		var directive = {
			scope: {
				filterHandler: '=',
				tagData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/tag.html',
			link: tagLink
		};

		return directive;
	};

	app.directive('tag', tagDirective);
})(angular.module('filterPageApp'));