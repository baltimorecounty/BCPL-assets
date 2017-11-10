((app) => {
	const eventDirective = (eventDataDateFormattingService) => {
		const eventLink = ($scope) => {
			const eventItem = $scope.eventItem;

			$scope.EventScheduleString =
				eventDataDateFormattingService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
		};

		const directive = {
			restrict: 'E',
			templateUrl: '/dist/js/apps/events-page/templates/event.html',
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['eventDataDateFormattingService'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));
