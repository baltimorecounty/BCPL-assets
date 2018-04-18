((app, bootstrapCollapseHelper) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl(
		$document,
		$scope,
		$timeout,
		$animate,
		$location,
		$window,
		CONSTANTS,
		eventsService,
		filterHelperService,
		metaService,
		RequestModel
	) {
		const vm = this;
		const filterTypes = ['locations', 'eventTypes', 'ageGroups'];

		const getStartDateLocaleString = () => $window.moment().format();
		const getEndDateLocaleString = () => $window.moment().add(30, 'd').format();

		/**
         * This contains the state of the filters on the page, this should match the most recent request, and results should be
         * visible on the page
         */
		vm.requestModel = new RequestModel();

		const eventDateBarStickySettings = {
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

		const getFilterPanelStatus = (model) => {
			const activePanels = [];
			const inActivePanels = [];
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
				activePanels,
				inActivePanels
			};
		};

		vm.filterEvents = (eventRequestModel, isInit, callback) => {
			// Clear out existing list of events
			vm.eventGroups = [];

			// Let user know we are retreiving a new list of events
			vm.isLoading = true;
			vm.hasResults = true; // Do this to make sure the user doesn't see the no results message it will be updated below
			vm.requestErrorMessage = '';
			vm.requestModel = eventRequestModel;

			const startDatePicker = angular.element('#start-date')[0]._flatpickr; // eslint-disable-line 
			const endDatePicker = angular.element('#end-date')[0]._flatpickr; // eslint-disable-line 

			startDatePicker && startDatePicker.setDate($window.moment(eventRequestModel.StartDate).toDate()); // eslint-disable-line no-unused-expressions
			endDatePicker && endDatePicker.setDate($window.moment(eventRequestModel.EndDate).toDate()); // eslint-disable-line no-unused-expressions
			vm.userStartDate = $window.moment(eventRequestModel.StartDate).format('MMMM DD, YYYY');
			vm.userEndDate = $window.moment(eventRequestModel.EndDate).format('MMMM DD, YYYY');

			eventsService
				.get(eventRequestModel)
				.then((events) => {
					processEvents(events);

					vm.hasResults = !!getTotalResults(events);

					const filterPanelStatuses = getFilterPanelStatus(eventRequestModel);

					if (isInit) {
						bootstrapCollapseHelper.toggleCollapseByIds(filterPanelStatuses);
					}

					if (callback && typeof callback === 'function') {
						callback(events);
					}
				})
				.catch(handleFailedEventsGetRequest);
		};

		/** HELPERS */
		const getTotalResults = (events) => events && Object.prototype.hasOwnProperty.call(events, 'totalResults') ?
			events.totalResults : 0;

		/** FILTER STUFF */
		vm.keywordSearch = () => {
			const newRequestModel = Object.assign({}, vm.requestModel);

			newRequestModel.Keyword = vm.keywords;
			newRequestModel.Page = 1;

			filterHelperService.setQueryParams([{
				key: 'term',
				val: vm.keywords
			}]); // This will trigger a location change, therefore getting the new results
		};

		vm.filterByDate = () => {
			vm.areDatesInvalid = !isDateRangeValid(vm.userStartDate, vm.userEndDate);

			if (!vm.areDatesInvalid) {
				const newRequestModel = Object.assign({}, vm.requestModel);

				newRequestModel.StartDate = vm.userStartDate;
				newRequestModel.EndDate = vm.userEndDate;
				newRequestModel.Page = 1;

				filterHelperService.setQueryParams([
					{
						key: 'startDate',
						val: vm.userStartDate
					},
					{
						key: 'endDate',
						val: vm.userEndDate
					}
				]); // This will trigger a location change, therefore getting the new results
			}
		};

		vm.clearFilters = () => {
			resetRequestModel();

			resetUIFilterFields();

			filterHelperService.clearQueryParams();

			vm.filterEvents(vm.requestModel);
		};

		vm.loadNextPage = () => {
			const newRequestModel = Object.assign({}, vm.requestModel);
			newRequestModel.Page += 1;

			vm.requestModel = newRequestModel;

			// TODO: Realistically this should add a url here, too
			eventsService.get(newRequestModel).then(processAndCombineEvents).then(() => {
				$timeout(() => {
					$('.event-date-bar').sticky(eventDateBarStickySettings);
				});
			});
		};

		const setFilterData = (key, values) => {
			if (!Object.prototype.hasOwnProperty.call(vm.data, key)) { // Only set this one time
				vm.data[key] = values;
			}
		};

		vm.filterByTerms = (id, itemType, isChecked, filterVal, shouldUpdateLocation = true) => {
			const newRequestModel = Object.assign({}, vm.requestModel);

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

		const handleFailedEventsGetRequest = () => {
			vm.isLoading = false;
			vm.requestErrorMessage = 'There was a problem retrieving events. Please try again later.';
		};

		const toggleFilter = (collection, id, shouldAddToCollection, filterKey, filterVal, shouldUpdateLocation) => {
			if (shouldAddToCollection) {
				collection.push(id);
			} else {
				const indexOfId = collection.indexOf(id);

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

		const resetRequestModel = () => {
			vm.requestModel = new RequestModel();
		};

		const resetUIFilterFields = () => {
			vm.keywords = '';
			vm.userStartDate = '';
			vm.userEndDate = '';
		};

		/* ** Private ** */

		const processEvents = (eventResults) => {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.isLoading = false;
			vm.eventGroups = eventResults.eventGroups;
			vm.hasResults = eventResults.eventGroups.length;
			vm.requestErrorMessage = '';

			$timeout(() => {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			});
		};

		const processAndCombineEvents = (eventResults) => {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = combineEventGroups(vm.eventGroups, eventResults.eventGroups);
		};

		const isLastPage = (totalResults) => {
			const totalResultsSoFar = vm.requestModel.Page * vm.chunkSize;
			return totalResultsSoFar >= totalResults;
		};

		const isDateRangeValid = (firstDate, secondDate) => {
			if (firstDate && secondDate) {
				return $window.moment(firstDate).isSameOrBefore(secondDate);
			}
			return false;
		};

		const isSameDay = (day1Date, day2Date) => day1Date && day2Date ?
			$window.moment(day1Date).isSame(day2Date, 'day') :
			false;

		const combineEventGroups = (oldEventGroups, newEventGroups) => {
			let renderedEventGroups = oldEventGroups;
			let lastEventGroup = renderedEventGroups[renderedEventGroups.length - 1];

			angular.forEach(newEventGroups, (eventGroup) => {
				if (isSameDay(lastEventGroup.date, eventGroup.date)) {
					lastEventGroup.events = lastEventGroup.events.concat(eventGroup.events);
				} else {
					renderedEventGroups.push(eventGroup);
				}
			});

			return renderedEventGroups;
		};

		const toggleIcon = (collapseEvent) => {
			const $collapsible = angular.element(collapseEvent.currentTarget);
			const $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		const getKeywords = () => $location.search().term && $location.search().term.length ?
			$location.search().term :
			'';

		/* ** Init ** */
		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		const getFilterId = (filterType, val) => {
			if (!val) return -1;

			const filterTypeExists = Object.prototype.hasOwnProperty.call(vm.data, filterType);

			if (filterTypeExists) {
				const matchedFilters = vm.data[filterType].filter(filter => {
					return Object.prototype.hasOwnProperty.call(filter, 'Name') && filter.Name.toLowerCase().trim() === val.toLowerCase().trim();
				});

				if (filterType === 'locations') {
					return matchedFilters.length ? matchedFilters[0].LocationId : null;
				}
				return matchedFilters.length ? matchedFilters[0].Id : null;
			}

			return -1;
		};

		const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;
		const isFilterADate = (filterType) => filterType && filterType.toLowerCase().indexOf('date') > -1;
		const upperCaseFirstLetter = (word) => word.replace(/^\w/, (chr) => chr.toUpperCase());

		const getRequestModelBasedOnQueryParams = () => {
			const newRequestModel = Object.assign({}, vm.requestModel);
			const queryParams = filterHelperService.getQueryParams();

			if (isEmptyObject(queryParams)) {
				resetUIFilterFields();
				return vm.requestModel;
			}

			// Build the request model

			// Keywords
			const keywords = getKeywords();
			newRequestModel.Keyword = keywords;
			vm.keywords = keywords;

			// Dates
			const requestDates = getDatesFromUrl(queryParams);

			if (requestDates) {
				newRequestModel.StartDate = requestDates.startDate;
				newRequestModel.EndDate = requestDates.endDate;
			}

			// Lists
			const queryParamKeys = Object.keys(queryParams);

			queryParamKeys.forEach((filterType) => {
				const isFilterTypeDate = isFilterADate(filterType);

				if (!isFilterTypeDate) {
					const filterValStr = queryParams[filterType];
					const filterValues = filterHelperService.getFiltersFromString(filterValStr);

					filterValues.forEach((filterVal) => {
						const filterId = getFilterId(filterType, filterVal);

						if (filterId && filterId > -1) {
							let requestModelKey = upperCaseFirstLetter(filterType);

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

		const getFilterArray = (targetFilterArray, targetVal) => {
			let newArray = targetFilterArray ?
				targetFilterArray.slice() :
				[];
			const doesTargetValueExist = targetFilterArray && targetFilterArray.length && targetFilterArray.includes(targetVal);

			if (doesTargetValueExist) {
				newArray = targetFilterArray.filter(x => x !== targetVal);
			} else {
				newArray.push(targetVal);
			}

			return newArray;
		};

		const filterDataSuccessHandler = (data, filterType, callback) => {
			setFilterData(filterType, data);

			if (callback && typeof callback === 'function') {
				callback();
			}
		};

		const filterDataErrorHandler = (error, callback) => {
			if (callback && typeof callback === 'function') {
				callback(error);
			}
		};

		// We need to load these on the page first, so that we can use that data
		const setupListFilters = (successCallback, errorCallback) => {
			let url;
			let counter = 0;

			filterTypes.forEach((filterType) => {
				if (CONSTANTS.remoteServiceUrls[filterType]) {
					url = CONSTANTS.remoteServiceUrls[filterType];
				} else if (CONSTANTS.serviceUrls[filterType]) {
					url = `${CONSTANTS.baseUrl}${CONSTANTS.serviceUrls[filterType]}`;
				}

				metaService.request(url)
					.then(
						(data) => filterDataSuccessHandler(data, filterType, () => {
							counter += 1;

							if (counter === filterTypes.length) {
								successCallback();
							}
						}),
						(error) => filterDataErrorHandler(error, errorCallback)
					);
			});
		};

		const getDatesFromUrl = (queryParams) => {
			const userStartDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'startDate', true);
			const userEndDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'endDate', true);

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

		const updateResultsBasedOnFilters = (isInit) => {
			const newRequestModel = getRequestModelBasedOnQueryParams();

			vm.filterEvents(newRequestModel, isInit);
		};

		const initErrorCallback = () => eventsService
			.get(vm.requestModel)
			.then(processEvents)
			.catch(handleFailedEventsGetRequest);

		const init = () => {
			// setupListFilters sets the data to the view model
			setupListFilters(() => {
				updateResultsBasedOnFilters(true);
			}, initErrorCallback);
		};

		$scope.$on('$locationChangeSuccess', () => {
			resetRequestModel();

			updateResultsBasedOnFilters();
		});

		init();
	};

	EventsPageCtrl.$inject = [
		'$document',
		'$scope',
		'$timeout',
		'$animate',
		'$location',
		'$window',
		'events.CONSTANTS',
		'dataServices.eventsService',
		'sharedFilters.filterHelperService',
		'metaService',
		'RequestModel'
	];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'), bcpl.boostrapCollapseHelper);
