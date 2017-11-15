((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		const self = this;
		const firstPage = 1;
		const eventServiceRequestModel = {
			StartDate: new Date(),
			EndDate: new Date(),
			Page: firstPage,
			IsOngoingVisible: true
		};

		/* ** Public ** */

		self.eventGroups = [];

		self.chunkSize = CONSTANTS.requestChunkSize;

		self.loadNextPage = () => {
			eventServiceRequestModel.StartDate = addDays(eventServiceRequestModel.StartDate, 1);
			eventServiceRequestModel.EndDate = addDays(eventServiceRequestModel.EndDate, 1);

			eventsService.get(eventServiceRequestModel)
				.then((eventGroups) => {
					self.eventGroups = self.eventGroups.concat(eventGroups);
				});
		};

		/* ** Private ** */

		const addDays = (dateOrString, daysToAdd) => {
			const date = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;

			if (typeof date !== 'object') {
				return date;
			}

			date.setDate(date.getDate() + daysToAdd);

			return date;
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
