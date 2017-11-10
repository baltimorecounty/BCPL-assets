((app) => {
	const eventDirective = (eventDataFormattingService) => {
		const eventLink = ($scope, eventElement, eventElementAttributes) => {
			const eventData = eventElementAttributes.eventData;

			eventData.EventScheduleString =
				eventDataFormattingService.formatSchedule(eventData.EventStart, eventData.EventLength);
		};

		const directive = {
			scope: {
				eventData: '='
			},
			restrict: 'E',
			templateUrl: '/dist/js/apps/events-page/templates/event.html',
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['eventDataFormattingService'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));
