((app) => {
	'use strict';

	const EventDetailsCtrl = function EventsPageCtrl($scope, $window, $timeout, $routeParams, CONSTANTS, eventsService, dateUtilityService) {
		const vm = this;
		const id = $routeParams.id;

		vm.data = {};
		vm.data.EventStartDate = '';
		vm.data.EventStartTime = '';
		vm.data.EventEndTime = '';
		vm.isLoading = true;
		vm.isError = false;
		vm.requestErrorMessage = 'Unfortunately, there was a problem loading this event\'s details. Please try again in a few minutes.';

		const getEmailBodyHtml = () => {
			const currentPage = $window.location.href;
			const {
				AgeGroupsString,
				EventStartDate,
				EventSchedule,
				EventTypesString,
				LocationName,
				Title
			} = vm.data;

			return `${Title} \n ${currentPage}`;
		};

		const getEmailSubject = () => {
			const { EventStartDate, Title } = vm.data;
			return `${EventStartDate} - ${Title}`;
		};

		const processEventData = (data) => {
			vm.data = data;
			vm.data.EventStartDate = moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength, vm.data.AllDay);
			vm.isRegistrationRequired = vm.data.RegistrationTypeCodeEnum !== 0;
			vm.isOver = moment().isAfter(moment(vm.data.EventStart).add(vm.data.EventLength, 'm'));
			vm.isLoading = false;
			vm.emailSubject = getEmailSubject();
			vm.emailBody = getEmailBodyHtml();
			vm.shareUrl = `mailto:?subject=${vm.emailSubject}&body=${vm.emailBody}`;
		};

		const requestError = (errorResponse) => {
			vm.isLoading = false;
			vm.isError = true;
		};

		eventsService
			.getById(id)
			.then(processEventData)
			.catch(requestError);
	};

	EventDetailsCtrl.$inject = ['$scope', '$window', '$timeout', '$routeParams', 'events.CONSTANTS', 'dataServices.eventsService', 'dateUtilityService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'));
