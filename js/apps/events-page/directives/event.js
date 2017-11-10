((app) => {
	const eventDirective = (eventDataFormattingService) => {
		const eventLink = ($scope) => {
			let eventData = $scope.eventData;

			$scope.EventScheduleString =
				eventDataFormattingService.formatSchedule(eventData.EventStart, eventData.EventLength);
		};

		const directive = {
			restrict: 'E',
			templateUrl: '/dist/js/apps/events-page/templates/event.html',
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['eventDataFormattingService'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));
