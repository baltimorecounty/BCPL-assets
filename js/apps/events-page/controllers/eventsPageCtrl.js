((app, bootstrapCollapseHelper) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl(
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

		/**
         * This contains the state of the filters on the page, this should match the most recent request, and results should be
         * visible on the page
         */
		vm.requestModel = new RequestModel();

		const firstPage = 1;
		const startDateLocaleString = $window.moment().format();
		const endDate = $window.moment().add(30, 'd');
		const endDateLocaleString = endDate.format();
		const requestModel = {
			StartDate: startDateLocaleString,
			EndDate: endDateLocaleString,
			Page: firstPage,
			IsOngoingVisible: true,
			IsSpacesReservationVisible: false,
			Limit: CONSTANTS.requestChunkSize,
			EventsTypes: [],
			AgeGroups: [],
			Locations: []
		};

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

		const getStartDateLocaleString = () => $window.moment().format();
		const getEndDateLocaleString = () => $window.moment().add(30, 'd').format();


		vm.filterEvents = (eventRequestModel, callback) => {
			// Clear out existing list of events
			vm.eventGroups = [];

			// Let user know we are retreiving a new list of events
			vm.isLoading = true;
			vm.hasResults = true; // Do this to make sure the user doesn't see the no results message it will be updated below
			vm.requestErrorMessage = '';

			eventsService
				.get(eventRequestModel)
				.then((events) => {
					processEvents(events);

					vm.hasResults = !!getTotalResults(events);

					vm.requestModel = eventRequestModel;

					if (callback && typeof callback === 'function') {
						callback(events);
					}
				})
				.catch(handleFailedEventsGetRequest);
		};

		/** HELPERS */
		const getTotalResults = (events) => events && Object.prototype.hasOwnProperty.call(events, 'totalResults') ?
			events.totalResults : 0;


		/** URL STUFF */
		const updateFilterUrl = (keyValList) => {
			const termFilter = keyValList.filter(x => x.key === 'term');
			const otherFilters = keyValList.filter(x => x.key !== 'term');

			const valueExists = otherFilters.filter(x => !!x.val).length;

			if (!valueExists || termFilter.length) {
				const targetKeys = keyValList.map(keyVal => keyVal.key);
				filterHelperService.clearQueryParams(targetKeys);
			} else {
				filterHelperService.updateQueryParams(keyValList);
			}
		};

		/** FILTER STUFF */
		vm.keywordSearch = () => {
			const newRequestModel = Object.assign({}, vm.requestModel);

			newRequestModel.Keyword = vm.keywords;
			newRequestModel.StartDate = getStartDateLocaleString();
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

				updateFilterUrl([
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

			vm.filterEvents(vm.requestModel, () => '');
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

			vm.filterEvents(newRequestModel, () => '');
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

		// GOOD
		const processEvents = (eventResults) => {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = eventResults.eventGroups;
			vm.isLoading = false;
			vm.hasResults = eventResults.eventGroups.length;
			vm.requestErrorMessage = '';

			$timeout(() => {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			});
		};

		// GOOD
		const processAndCombineEvents = (eventResults) => {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = combineEventGroups(vm.eventGroups, eventResults.eventGroups);
		};

		// GOOD
		const isLastPage = (totalResults) => {
			const totalResultsSoFar = vm.requestModel.Page * vm.chunkSize;
			return totalResultsSoFar >= totalResults;
		};

		// GOOD
		const isDateRangeValid = (firstDate, secondDate) => {
			if (firstDate && secondDate) {
				return $window.moment(firstDate).isSameOrBefore(secondDate);
			}
			return false;
		};

		// GOOD
		const isSameDay = (day1Date, day2Date) => day1Date && day2Date ?
			$window.moment(day1Date).isSame(day2Date, 'day') :
			false;

		// GOOD
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

		// GOOD
		const toggleIcon = (collapseEvent) => {
			const $collapsible = angular.element(collapseEvent.currentTarget);
			const $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		// GOOD
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

			if (keywords) {
				newRequestModel.Keyword = keywords;
				vm.keywords = keywords;
			}

			// Dates
			const requestDates = getDatesFromUrl(queryParams);

			if (requestDates) {
				newRequestModel.StartDate = requestDates.StartDate;
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

					bootstrapCollapseHelper.toggleCollapseById(filterType);
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
			const filterTypes = ['locations', 'eventTypes', 'ageGroups'];
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

		const updateResultsBasedOnFilters = () => {
			const newRequestModel = getRequestModelBasedOnQueryParams();

			vm.filterEvents(newRequestModel, () => '');
		};

		const initErrorCallback = () => eventsService
			.get(requestModel)
			.then(processEvents)
			.catch(handleFailedEventsGetRequest);

		const init = () => {
			// setupListFilters sets the data to the view model
			setupListFilters(updateResultsBasedOnFilters, initErrorCallback);
		};

		$scope.$on('$locationChangeSuccess', () => {
			resetRequestModel();

			updateResultsBasedOnFilters();
		});

		init();
	};

	EventsPageCtrl.$inject = [
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
