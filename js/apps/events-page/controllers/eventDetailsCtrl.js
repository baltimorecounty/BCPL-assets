((app) => {
	'use strict';

	const EventDetailsCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		const self = this;
	};

	EventDetailsCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'));
