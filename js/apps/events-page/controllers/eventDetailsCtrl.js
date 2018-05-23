((app, ICS) => {
	'use strict';

	const EventDetailsCtrl = function EventsPageCtrl(
		$scope,
		$window,
		$timeout,
		$routeParams,
		CONSTANTS,
		eventsService,
		dateUtilityService,
		emailUtilityService,
		downloadCalendarEventService,
		ageDisclaimerService,
		addthisService
	) {
		$window.scrollTo(0, 0); // Ensure the event details are visible on mobile

		const vm = this;
		const id = $routeParams.id;

		vm.data = {};
		vm.data.EventStartDate = '';
		vm.data.EventStartTime = '';
		vm.data.EventEndTime = '';
		vm.isLoading = true;
		vm.isError = false;
		vm.requestErrorMessage = CONSTANTS.eventDetailsError.message;

		const processEventData = (data) => {
			if (Object.prototype.hasOwnProperty.call(data, 'EventId') && !data.EventId) {
				requestError();
				return;
			}

			vm.data = data;
			vm.data.EventStartDate = $window.moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data, vm.data.EventLength, vm.data.AllDay);
			vm.isRegistrationRequired = vm.data.RegistrationTypeCodeEnum !== 0;
			const eventDate = vm.data.EventStart || vm.data.OnGoingStartDate;
			vm.eventDayOfWeek = $window.moment(eventDate).format('dddd');
			vm.onGoingEventEndDayOfWeek = vm.data.OnGoingEndDate && $window.moment(vm.data.OnGoingEndDate).format('dddd');
			vm.isOver = vm.data.EventStart
				? $window.moment().isAfter($window.moment(eventDate).add(vm.data.EventLength, 'm'))
				: $window.moment().startOf('day').isAfter($window.moment(eventDate).endOf('day'));
			vm.isLoading = false;
			vm.shareUrl = emailUtilityService.getShareUrl(vm.data, $window.location.href);
			vm.shouldShowDisclaimer = ageDisclaimerService.shouldShowDisclaimer(vm.data);
			vm.disclaimer = CONSTANTS.ageDisclaimer.message;
			vm.downloadUrl = `${CONSTANTS.baseUrl}${CONSTANTS.serviceUrls.downloads}/${id}`;

			addthisService.update($window.location.href, `${vm.data.LocationName} - ${vm.data.Title}`);
		};

		const requestError = () => {
			vm.isLoading = false;
			vm.isError = true;
		};

		eventsService
			.getById(id)
			.then(processEventData)
			.catch(requestError);
	};

	EventDetailsCtrl.$inject = ['$scope', '$window', '$timeout', '$routeParams', 'events.CONSTANTS',
		'dataServices.eventsService', 'dateUtilityService', 'emailUtilityService', 'downloadCalendarEventService', 'ageDisclaimerService', 'addthisService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'), window.ics);
