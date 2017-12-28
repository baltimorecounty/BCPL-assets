((app) => {
	'use strict';

	const EventRegistrationCtrl = function EventsPageCtrl($scope, $routeParams, eventsService, dateUtilityService) {
		const id = $routeParams.id;

		const vm = this;

		vm.isGroup = 'false';

		vm.submit = (submitEvent) => {
			console.log(submitEvent);
		};

		const processEventData = (data) => {
			vm.data = data;
			vm.data.EventSchedule =	dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength);
		};

		eventsService.getById(id).then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$scope', '$routeParams', 'eventsService', 'dateUtilityService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'));
