((app) => {
	'use strict';

	const EventRegistrationCtrl = function EventsPageCtrl($scope, $routeParams, eventsService) {
		const vm = this;
		const id = $routeParams.id;

		const processEventData = (data) => {
			vm.data = data;
		};

		eventsService.getById(id).then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$scope', '$routeParams', 'eventsService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'));
