((app, bootstrapCollapseHelper) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl(
		$scope,
		$timeout,
		$animate,
		$location,
		CONSTANTS,
		eventsService,
		filterHelperService, 
		metaService
	) {

		const vm = this;
		const firstPage = 1;
		const startDateLocaleString = moment().format();
		const endDate = moment().add(30, 'd');
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

		vm.locations = requestModel.Locations;

		vm.eventsTypes = requestModel.EventsTypes;
		vm.ageGroups = requestModel.AgeGroups;

		vm.keywordSearch = () => {
			requestModel.Keyword = vm.keywords;
			requestModel.StartDate = startDateLocaleString;
			requestModel.Page = 1;
			vm.eventGroups = [];
			vm.hasResults = true;
			vm.isLoading = true;

			updateFilterUrl('term', vm.keywords);

			eventsService
				.get(requestModel)
				.then(processEvents)
				.catch(handleFailedEventsGetRequest);
		};

		const updateFilterUrl = (targetKey, vmModel) => {
			if (vmModel) {
				filterHelperService.setQueryParams(targetKey, vmModel);
			}
			else {
				filterHelperService.clearQueryParams(targetKey);
			}
		};

		vm.filterByDate = () => {
			vm.areDatesInvalid = !isDateRangeValid(vm.userStartDate, vm.userEndDate);


			if (!vm.areDatesInvalid) {
				requestModel.StartDate = vm.userStartDate;
				requestModel.EndDate = vm.userEndDate;
				requestModel.Page = 1;
				vm.eventGroups = [];
				vm.hasResults = true;
				vm.isLoading = true;
				vm.requestErrorMessage = '';

				updateFilterUrl('startDate', vm.userStartDate);
				updateFilterUrl('endDate', vm.userEndDate);

				eventsService
					.get(requestModel)
					.then(processEvents)
					.catch(handleFailedEventsGetRequest);
			}
		};

		const setFilterData = (key, values) => {
			if (!Object.hasOwnProperty.call(vm.data, key)) { // Only set this one time
				vm.data[key] = values;
			}
		};

		vm.filterByTerms = (id, itemType, isChecked, filterVal, shouldUpdateLocation = true) => {
			switch (itemType.toLowerCase()) {
			case 'locations':
				toggleFilter(requestModel.Locations, id, isChecked, itemType, filterVal, shouldUpdateLocation);
				break;
			case 'agegroups':
				toggleFilter(requestModel.AgeGroups, id, isChecked, itemType, filterVal, shouldUpdateLocation);
				break;
			case 'eventtypes':
				toggleFilter(requestModel.EventsTypes, id, isChecked, itemType, filterVal, shouldUpdateLocation);
				break;
			default:
				break;
			}

			vm.eventGroups = [];
			vm.hasResults = true;
			vm.isLoading = true;

			eventsService
				.get(requestModel)
				.then(processEvents)
				.catch(handleFailedEventsGetRequest);
		};

		const handleFailedEventsGetRequest = (error) => {
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

			if(shouldUpdateLocation) {
				filterHelperService.updateQueryParams(filterKey, filterVal);
			}
		};

		vm.loadNextPage = () => {
			requestModel.Page += 1;

			eventsService.get(requestModel).then(processAndCombineEvents).then(() => {
				$timeout(() => {
					$('.event-date-bar').sticky(eventDateBarStickySettings);
				});
			});
		};

		vm.clearFilters = () => {
			requestModel.StartDate = startDateLocaleString;
			requestModel.EndDate = endDateLocaleString;
			requestModel.Page = 1;
			requestModel.Keyword = '';
			requestModel.AgeGroups = [];
			requestModel.EventsTypes = [];
			requestModel.Locations = [];

			vm.keywords = '';
			vm.userStartDate = '';
			vm.userEndDate = '';
			vm.eventGroups = [];
			vm.hasResults = true;
			vm.isLoading = true;
			vm.locations = requestModel.Locations;
			vm.eventsTypes = requestModel.EventsTypes;
			vm.ageGroups = requestModel.AgeGroups;

			filterHelperService.clearQueryParams();

			eventsService
				.get(requestModel)
				.then(processEvents)
				.catch(handleFailedEventsGetRequest);
		};

		/* ** Private ** */

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

		const processAndCombineEvents = (eventResults) => {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = combineEventGroups(vm.eventGroups, eventResults.eventGroups);
		};

		const isLastPage = (totalResults) => {
			const totalResultsSoFar = requestModel.Page * vm.chunkSize;
			return totalResultsSoFar >= totalResults;
		};

		const isDateRangeValid = (firstDate, secondDate) => {
			if (firstDate && secondDate) {
				return moment(firstDate).isSameOrBefore(secondDate);
			}

			return false;
		};

		const isSameDay = (day1Date, day2Date) => {
			if (day1Date && day2Date) {
				return moment(day1Date).isSame(day2Date, 'day');
			}

			return false;
		};

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

		const getKeywords = () => {
			return $location.search().term && $location.search().term.length ? 
				$location.search().term :
				"";
		};

		/* ** Init ** */
		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		const getFilterId = (filterType, val) => {
			if (!val) return;

			if (Object.hasOwnProperty.call(vm.data, filterType)) {
				const matchedFilters = vm.data[filterType].filter(filter => {
					return Object.hasOwnProperty.call(filter, 'Name') && filter.Name.toLowerCase().trim() === val.toLowerCase().trim();
				});

				if (filterType === 'locations') {
					return matchedFilters.length ? matchedFilters[0].LocationId : null;
				}
				return matchedFilters.length ? matchedFilters[0].Id : null;
			}

			return;
		};


		const setFiltersBasedOnQueryParams = () => {
			const queryParams = filterHelperService.getQueryParams();

			setDatesFromUrl(queryParams);

			Object.keys(queryParams).forEach((queryParamKey) => {
				const filterType = queryParamKey;
				const isFilterTypeDate = filterType && filterType.toLowerCase().indexOf('date') > -1;

				if (!isFilterTypeDate) {
					const filterValStr = queryParams[queryParamKey];
					const filterValues = filterHelperService.getFiltersFromString(filterValStr); 

					filterValues.forEach((filterVal) => {
						const filterId = getFilterId(filterType, filterVal);

						if (filterId) {
							vm.filterByTerms(filterId, filterType, true, filterVal, false);
							
						}
					});

					bootstrapCollapseHelper.toggleCollapseById(filterType);
				}
			});
		};

		const setIntialFilterData = (callback) => {
			const filterTypes = ['locations', 'eventTypes', 'ageGroups'];
			let counter = 0;

			filterTypes.forEach((filterType, index) => {
				if (CONSTANTS.remoteServiceUrls[filterType]) {
					metaService.request(CONSTANTS.remoteServiceUrls[filterType]).then((data) => {
						setFilterData(filterType, data);

						counter += 1;

						const isLastItem = counter === filterTypes.length;
						if (isLastItem && callback && typeof callback === 'function') {
							callback();
						}
					});
				}
			});
		};

		const setDatesFromUrl = (queryParams) => {
			const startDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'startDate', true);
			const endDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'endDate', true);

			if (startDate && endDate) {
				vm.userStartDate = startDate;
				vm.userEndDate = endDate;

				vm.filterByDate();
			}
		};
		
		const init = () => {
			// setIntialFilterData sets the data to the view model
			setIntialFilterData(() => { 
				setFiltersBasedOnQueryParams();

				const keywords = getKeywords();

				if (keywords) {
					vm.keywords = keywords;
					vm.keywordSearch();
				} else {
					eventsService
						.get(requestModel)
						.then(processEvents)
						.catch(handleFailedEventsGetRequest);
				}
			}); 
		};

		init();
	};

	EventsPageCtrl.$inject = [
		'$scope',
		'$timeout',
		'$animate',
		'$location',
		'events.CONSTANTS',
		'dataServices.eventsService',
		'sharedFilters.filterHelperService',
		'metaService'
	];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'), bcpl.boostrapCollapseHelper);
