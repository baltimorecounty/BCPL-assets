((app) => {
	'use strict';

	const EventRegistrationCtrl = function EventsPageCtrl($scope, $routeParams, eventsService, registrationService, dateUtilityService) {
		const id = $routeParams.id;

		const vm = this;

		vm.isGroup = 'false';
		vm.postResult = {};

		vm.submitHandler = () => {
			const postModel = {
				RegistrationModel: {
					EventId: parseInt(id, 10),
					FirstName: vm.firstName,
					LastName: vm.lastName,
					Email: vm.email,
					Phone: vm.phone,
					IsGroup: vm.isGroup === 'true',
					GroupCount: vm.groupCount
				}
			};

			registrationService.register(postModel).then(postResult => {
				vm.postResult = postResult.data;
			});
		};

		const processEventData = (data) => {
			vm.data = data;
			vm.data.EventSchedule =	dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength);
		};

		eventsService.getById(id).then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$scope', '$routeParams', 'eventsService', 'registrationService', 'dateUtilityService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'));
