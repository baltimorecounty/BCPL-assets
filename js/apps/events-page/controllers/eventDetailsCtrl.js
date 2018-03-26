((app, ICS) => {
	'use strict';

	const EventDetailsCtrl = function EventsPageCtrl($scope, $timeout, $routeParams, CONSTANTS, eventsService, dateUtilityService) {
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
			vm.data.EventStartDate = moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength, vm.data.AllDay);
			vm.isRegistrationRequired = vm.data.RegistrationTypeCodeEnum !== 0;
			vm.isOver = moment().isAfter(moment(vm.data.EventStart).add(vm.data.EventLength, 'm'));
			vm.isLoading = false;
		};

		vm.downloadEvent = function downloadEvent(clickEvent) {
			clickEvent.preventDefault();

			const { LocationName, Title } = vm.data;
			const eventTitle = `Baltimore County Library, ${LocationName} Branch - ${Title}`;
			const eventLocation = `${LocationName} Branch`;
			const eventDescription = 'This is an all day event';
			const eventStartDate = null;
			const eventEndDate = null;


			let calEvent = new ICS();

			calEvent.addEvent(eventTitle, eventDescription, eventLocation, eventStartDate, eventEndDate);
			calEvent.download(Title);
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

	EventDetailsCtrl.$inject = ['$scope', '$timeout', '$routeParams', 'events.CONSTANTS', 'dataServices.eventsService', 'dateUtilityService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'), window.ics);
