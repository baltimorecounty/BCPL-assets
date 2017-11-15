((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService, dateUtility) {
		const self = this;
		const firstPage = 1;
		const requestModel = {
			StartDate: new Date(),
			EndDate: new Date(),
			Page: firstPage,
			IsOngoingVisible: true
		};

		/* ** Public ** */

		self.eventGroups = [];

		self.chunkSize = CONSTANTS.requestChunkSize;

		self.loadNextPage = () => {
			requestModel.StartDate = dateUtility.addDays(requestModel.StartDate, 1);
			requestModel.EndDate = dateUtility.addDays(requestModel.EndDate, 1);

			eventsService.get(requestModel)
				.then((eventGroups) => {
					self.eventGroups = self.eventGroups.concat(eventGroups);
				});
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
