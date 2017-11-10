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

		eventsService.get(eventServiceRequestModel, (eventGroups) => {
			self.eventGroups = eventGroups;

			$timeout(() => {
				angular.element('.event-date-bar').sticky({
					topSpacing: 0,
					getWidthFrom: 'body',
					zIndex: 100
				});
			}, 0);
		}, () => {});
	};

	EventsPageCtrl.$inject = ['$scope', '$animate', '$timeout', 'CONSTANTS', 'eventsService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
