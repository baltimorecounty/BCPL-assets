((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, CONSTANTS, eventsService) {
		const self = this;

		const eventServiceRequestModel = {
			Limit: CONSTANTS.requestChunkSize
		};

		eventsService.get(eventServiceRequestModel)
			.then((eventGroups) => {
				self.eventGroups = eventGroups;
			});
	};

	EventsPageCtrl.$inject = ['$scope', 'CONSTANTS', 'eventsService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
