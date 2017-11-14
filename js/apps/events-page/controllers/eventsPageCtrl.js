((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		const self = this;
		const firstPage = 1;
		const eventServiceRequestModel = {
			Limit: CONSTANTS.requestChunkSize,
			Page: firstPage,
			IsOngoingVisible: true
		};

		/* ** Public ** */

		self.eventGroups = [];

		self.chunkSize = CONSTANTS.requestChunkSize;

		self.loadNextPage = () => {
			eventServiceRequestModel.Page += 1;

			eventsService.get(eventServiceRequestModel)
				.then((eventGroups) => {
					const results = combineEventGroups(self.eventGroups, eventGroups);
					self.eventGroups = results;
				});
		};

		/* ** Private ** */

		/**
		 * Compares dates base on locale date string.
		 * @param {Date} day1Date
		 * @param {Date} day2Date
		 */
		const isSameDay = (day1Date, day2Date) => {
			if (day1Date.toLocaleDateString && day2Date.toLocaleDateString) {
				return day1Date.toLocaleDateString() === day2Date.toLocaleDateString();
			}

			return false;
		};

		/**
		 *
		 * @param {*} oldEventGroups
		 * @param {*} newEventGroups
		 */
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

		eventsService.get(eventServiceRequestModel)
			.then((eventGroups) => {
				self.eventGroups = eventGroups;
			});
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
