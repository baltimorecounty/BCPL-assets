((app, ICS) => {
	'use strict';

	const EventDetailsCtrl = function EventsPageCtrl($scope, $rootScope, $anchorScroll, $window, $timeout, $routeParams, CONSTANTS, eventsService, dateUtilityService, emailUtilityService, downloadCalendarEventService) {
		const vm = this;
		const id = $routeParams.id;

		vm.data = {};
		vm.data.EventStartDate = '';
		vm.data.EventStartTime = '';
		vm.data.EventEndTime = '';
		vm.isLoading = true;
		vm.isError = false;
		vm.requestErrorMessage = 'Unfortunately, there was a problem loading this event\'s details. Please try again in a few minutes.';

		const processEventData = (data) => {
			vm.data = data;
			vm.data.EventStartDate = $window.moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength, vm.data.AllDay);
			vm.isRegistrationRequired = vm.data.RegistrationTypeCodeEnum !== 0;
			vm.isOver = $window.moment().isAfter($window.moment(vm.data.EventStart).add(vm.data.EventLength, 'm'));
			vm.isLoading = false;
			vm.shareUrl = emailUtilityService.getShareUrl(vm.data, $window.location.href);
		};

		vm.downloadEvent = function downloadEvent(clickEvent) {
			clickEvent.preventDefault();

			downloadCalendarEventService.downloadCalendarEvent(vm.data);
		};

		const requestError = (errorResponse) => {
			vm.isLoading = false;
			vm.isError = true;
		};

		eventsService
			.getById(id)
			.then(processEventData)
			.catch(requestError);

		$window.scrollTo(0, 0);
	};

	EventDetailsCtrl.$inject = ['$scope', '$rootScope', '$anchorScroll', '$window', '$timeout', '$routeParams', 'events.CONSTANTS', 'dataServices.eventsService', 'dateUtilityService', 'emailUtilityService', 'downloadCalendarEventService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'), window.ics);
