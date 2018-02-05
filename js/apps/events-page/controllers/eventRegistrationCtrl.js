((app) => {
	'use strict';

	const EventRegistrationCtrl = function EventsPageCtrl($window, $scope, $routeParams, eventsService, registrationService, dateUtilityService) {
		const id = $routeParams.id;

		const vm = this;

		vm.isGroup = 'false';
		vm.isSubmitted = false;
		vm.isLoadingResults = false;

		vm.submitHandler = () => {
			vm.isLoadingResults = true;

			const postModel = {
				EventId: parseInt(id, 10),
				FirstName: vm.firstName,
				LastName: vm.lastName,
				Email: vm.email,
				Phone: vm.phone,
				IsGroup: vm.isGroup === 'true',
				GroupCount: vm.groupCount
			};

			registrationService.register(postModel).then(postResult => {
				// jQuery since ngAnimate can't do this.
				const topOfContent = angular.element('.main-content').first().offset().top;

				vm.postResult = postResult.data;
				vm.isSubmitted = true;
				vm.isLoadingResults = false;
				angular.element('html, body').animate({ scrollTop: topOfContent }, 250);
			});
		};

		const processEventData = (data) => {
			vm.data = data;
			vm.data.EventSchedule =	dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength, vm.data.AllDay);
		};

		eventsService.getById(id).then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$window', '$scope', '$routeParams', 'eventsService', 'registrationService', 'dateUtilityService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'));
