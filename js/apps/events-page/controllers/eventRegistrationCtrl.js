((app, bcFormat) => {
	'use strict';

	const EventRegistrationCtrl = function EventsPageCtrl($window, $scope, $routeParams, eventsService, registrationService, dateUtilityService, emailUtilityService) {
		const id = $routeParams.id;
		const vm = this;

		vm.showGroups = false;
		vm.isGroup = 'false';
		vm.isSubmitted = false;
		vm.isLoadingResults = false;
		vm.formConfirmationMessage = null;

		const hasConfirmationMessage = (data) => data && Object.prototype.hasOwnProperty.call(data, 'ConfirmationMessage') && data.ConfirmationMessage && data.ConfirmationMessage.length;

		vm.submitHandler = () => {
			vm.isLoadingResults = true;

			const postModel = {
				EventId: parseInt(id, 10),
				FirstName: vm.firstName,
				LastName: vm.lastName,
				Email: vm.email,
				Phone: bcFormat('phoneNumber', vm.phone, 'xxx-xxx-xxxx'),
				IsGroup: vm.isGroup === 'true',
				GroupCount: vm.groupCount
			};


			registrationService.register(postModel).then(postResult => {
				// jQuery since ngAnimate can't do this.
				const topOfContent = angular.element('.main-content').first().offset().top;
				vm.postResult = postResult.data;

				const data = vm.postResult.Data;

				if (hasConfirmationMessage(data)) {
					vm.formConfirmationMessage = data.ConfirmationMessage;
				} else {
					const hasErrors = vm.postResult && Object.prototype.hasOwnProperty.call(vm.postResult, 'Errors') && vm.postResult.Errors.length;

					vm.formConfirmationMessage = hasErrors ?
						vm.postResult.Errors[0].Error :
						'Something went wrong, please try again later';
				}

				vm.isSubmitted = true;
				vm.isLoadingResults = false;
				angular.element('html, body').animate({
					scrollTop: topOfContent
				}, 250);
			});
		};

		const processEventData = (data) => {
			vm.data = data;
			vm.data.EventStartDate = $window.moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength, vm.data.AllDay);
			vm.shareUrl = emailUtilityService.getShareUrl(vm.data, $window.location.href);
		};

		eventsService
			.getById(id)
			.then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$window', '$scope', '$routeParams', 'dataServices.eventsService', 'registrationService', 'dateUtilityService', 'emailUtilityService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'), bcpl.utility.format);

