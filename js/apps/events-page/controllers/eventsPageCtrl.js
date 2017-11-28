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

		self.keywordSearch = () => {
			requestModel.Keyword = self.keywords;
			requestModel.StartDate = startDateLocaleString;
			requestModel.Page = 1;
			self.eventGroups = [];
			self.hasResults = true;
			self.isLoading = true;

			eventsService.get(requestModel).then(processEvents);
		};

		self.filterByDate = () => {
			if (isDateRangeValid(self.userStartDate, self.userEndDate)) {
				self.areDatesInvalid = false;
				requestModel.StartDate = self.userStartDate;
				requestModel.EndDate = self.userEndDate;
				requestModel.Page = 1;
				self.eventGroups = [];
				self.hasResults = true;
				self.isLoading = true;

				eventsService.get(requestModel).then(processEvents);
			} else {
				self.areDatesInvalid = true;
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

			eventsService.get(requestModel).then(processEvents);
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

			eventsService.get(requestModel).then(processAndCombineEvents);
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

			eventsService.get(requestModel).then(processEvents);
		};

		/* ** Private ** */

		const processEvents = (eventResults) => {
			self.isLastPage = isLastPage(eventResults.totalResults);
			self.eventGroups = eventResults.eventGroups;
			self.isLoading = false;
			self.hasResults = eventResults.eventGroups.length;

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

		const showFilters = (collapseEvent) => {
			const $collapsible = angular.element(collapseEvent.currentTarget);
			const $collapseControl = $collapsible.siblings('.collapse-control');

			$collapseControl.html('<i class="fa fa-minus"></i> Hide Filters');
		};

		const hideFilters = (collapseEvent) => {
			const $collapsible = angular.element(collapseEvent.currentTarget);
			const $collapseControl = $collapsible.siblings('.collapse-control');

			$collapseControl.html('<i class="fa fa-plus"></i> Show Filters');
		};
		/* ** Init ** */

		angular.element(document).on('hidden.bs.collapse', '#filter-items-wrapper', hideFilters);
		angular.element(document).on('shown.bs.collapse', '#filter-items-wrapper', showFilters);

		eventsService.get(requestModel).then(processEvents);
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', '$animate', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
