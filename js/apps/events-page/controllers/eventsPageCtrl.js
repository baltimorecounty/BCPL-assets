((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		const self = this;
		const firstPage = 1;
		const startDateLocaleString = (new Date()).toLocaleString();
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);
		const endDateLocaleString = endDate.toLocaleString();
		const requestModel = {
			StartDate: startDateLocaleString,
			EndDate: endDateLocaleString,
			Page: firstPage,
			IsOngoingVisible: true,
			Limit: CONSTANTS.requestChunkSize
		};

		/* ** Public ** */

		self.eventGroups = [];
		self.keywords = '';
		self.chunkSize = CONSTANTS.requestChunkSize;
		self.totalResults = 0;
		self.isLastPage = false;
		self.areDatesInvalid = false;

		self.keywordSearch = () => {
			requestModel.Keyword = self.keywords;
			requestModel.StartDate = startDateLocaleString;
			requestModel.Page = 1;
			self.eventGroups = [];

			eventsService.get(requestModel).then(processEvents);
		};

		self.filterByDate = () => {
			if (isDateRangeValid(self.userStartDate, self.userEndDate)) {
				self.areDatesInvalid = false;
				requestModel.StartDate = self.userStartDate;
				requestModel.EndDate = self.userEndDate;
				requestModel.Page = 1;
				self.eventGroups = [];

				eventsService.get(requestModel).then(processEvents);
			} else {
				self.areDatesInvalid = true;
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
			requestModel.keywords = '';

			self.keywords = '';
			self.userStartDate = '';
			self.userEndDate = '';
			self.eventGroups = [];

			eventsService.get(requestModel).then(processEvents);
		};

		/* ** Private ** */

		const processEvents = (eventResults) => {
			self.isLastPage = isLastPage(eventResults.totalResults);
			self.eventGroups = eventResults.eventGroups;
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

		/* ** Init ** */

		eventsService.get(requestModel).then(processEvents);
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
