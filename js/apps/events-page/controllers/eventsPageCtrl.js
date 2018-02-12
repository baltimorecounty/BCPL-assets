((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $timeout, $animate, CONSTANTS, eventsService) {
		const self = this;
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

		self.eventGroups = [];
		self.keywords = '';
		self.chunkSize = CONSTANTS.requestChunkSize;
		self.totalResults = 0;
		self.isLastPage = false;
		self.areDatesInvalid = false;
		self.isLoading = true;
		self.hasResults = true;

		self.locations = requestModel.Locations;
		self.eventsTypes = requestModel.EventsTypes;
		self.ageGroups = requestModel.AgeGroups;

		self.keywordSearch = () => {
			requestModel.Keyword = self.keywords;
			requestModel.StartDate = startDateLocaleString;
			requestModel.Page = 1;
			self.eventGroups = [];
			self.hasResults = true;
			self.isLoading = true;

			eventsService
				.get(requestModel)
				.then(processEvents)
				.catch(handleFailedEventsGetRequest);
		};

		self.filterByDate = () => {
			self.areDatesInvalid = !isDateRangeValid(self.userStartDate, self.userEndDate);
			if (!self.areDatesInvalid) {
				requestModel.StartDate = self.userStartDate;
				requestModel.EndDate = self.userEndDate;
				requestModel.Page = 1;
				self.eventGroups = [];
				self.hasResults = true;
				self.isLoading = true;
				self.requestErrorMessage = '';

				eventsService
					.get(requestModel)
					.then(processEvents)
					.catch(handleFailedEventsGetRequest);
			}
		};

		self.filterByTerms = (id, itemType, isChecked) => {
			switch (itemType.toLowerCase()) {
			case 'locations':
				toggleFilter(requestModel.Locations, id, isChecked);
				break;
			case 'agegroups':
				toggleFilter(requestModel.AgeGroups, id, isChecked);
				break;
			case 'eventtypes':
				toggleFilter(requestModel.EventsTypes, id, isChecked);
				break;
			default:
				break;
			}

			self.eventGroups = [];
			self.hasResults = true;
			self.isLoading = true;

			eventsService
				.get(requestModel)
				.then(processEvents)
				.catch(handleFailedEventsGetRequest);
		};

		const handleFailedEventsGetRequest = (error) => {
			self.isLoading = false;
			self.requestErrorMessage = "There was a problem retrieving events. Please try again later.";
		};

		const toggleFilter = (collection, id, shouldAddToCollection) => {
			if (shouldAddToCollection) {
				collection.push(id);
			} else {
				const indexOfId = collection.indexOf(id);

				if (indexOfId !== -1) {
					collection.splice(indexOfId, 1);
				}
			}
		};

		self.loadNextPage = () => {
			requestModel.Page += 1;

			eventsService.get(requestModel).then(processAndCombineEvents).then(() => {
				$timeout(() => {
					$('.event-date-bar').sticky(eventDateBarStickySettings);
				});
			});
		};

		self.clearFilters = () => {
			requestModel.StartDate = startDateLocaleString;
			requestModel.EndDate = endDateLocaleString;
			requestModel.Page = 1;
			requestModel.Keyword = '';
			requestModel.AgeGroups = [];
			requestModel.EventsTypes = [];
			requestModel.Locations = [];

			self.keywords = '';
			self.userStartDate = '';
			self.userEndDate = '';
			self.eventGroups = [];
			self.hasResults = true;
			self.isLoading = true;
			self.locations = requestModel.Locations;
			self.eventsTypes = requestModel.EventsTypes;
			self.ageGroups = requestModel.AgeGroups;
	
			eventsService
				.get(requestModel)
				.then(processEvents)
				.catch(handleFailedEventsGetRequest);
		};

		/* ** Private ** */

		const processEvents = (eventResults) => {
			self.isLastPage = isLastPage(eventResults.totalResults);
			self.eventGroups = eventResults.eventGroups;
			self.isLoading = false;
			self.hasResults = eventResults.eventGroups.length;
			self.requestErrorMessage = '';

			$timeout(() => {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			});
		};

		const processAndCombineEvents = (eventResults) => {
			self.isLastPage = isLastPage(eventResults.totalResults);
			self.eventGroups = combineEventGroups(self.eventGroups, eventResults.eventGroups);
		};

		const isLastPage = (totalResults) => {
			const totalResultsSoFar = requestModel.Page * self.chunkSize;
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

		/* ** Init ** */

		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		eventsService
			.get(requestModel)
			.then(processEvents)
			.catch(handleFailedEventsGetRequest);
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', '$animate', 'events.CONSTANTS', 'dataServices.eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
