((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		const self = this;
		const firstPage = 1;
		const startDateLocaleString = (new Date()).toLocaleString();
		const endDate = new Date();
		const endDateLocaleString = endDate.setMonth(endDate.getMonth() + 1).toLocaleString();
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

		self.keywordSearch = () => {
			requestModel.Keyword = self.keywords;
			requestModel.StartDate = startDateLocaleString;
			self.eventGroups = [];

			eventsService.get(requestModel)
				.then((eventGroups) => {
					self.eventGroups = eventGroups;
				});
		};

		self.loadNextPage = () => {
			requestModel.Page += 1;

			eventsService.get(requestModel)
				.then((eventGroups) => {
					const results = combineEventGroups(self.eventGroups, eventGroups);
					self.eventGroups = results;
				});
		};

		/* ** Private ** */

		const isSameDay = (day1Date, day2Date) => {
			if (day1Date.toLocaleDateString && day2Date.toLocaleDateString) {
				return day1Date.toLocaleDateString() === day2Date.toLocaleDateString();
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

		eventsService.get(requestModel)
			.then((eventGroups) => {
				self.eventGroups = eventGroups;
			});
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
