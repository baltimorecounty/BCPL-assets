((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $animate, $timeout,	CONSTANTS, eventsService) {
		const self = this;

		const eventServiceRequestModel = {
			StartDate: '11/1/2017',
			EndDate: '11/30/2017',
			Limit: 25,
			Page: 1
		};

		eventsService.get(eventServiceRequestModel, (response) => {
			self.events = response.data;
		}, () => {});
	};

	EventsPageCtrl.$inject = ['$scope', '$animate', '$timeout', 'CONSTANTS', 'eventsService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
