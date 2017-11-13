((app) => {
	const eventDirective = (eventDataDateFormattingService, CONSTANTS) => {
		const eventLink = ($scope) => {
			const eventItem = $scope.eventItem;

			$scope.EventScheduleString =
				eventDataDateFormattingService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
		};

		const directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.event,
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['eventDataDateFormattingService', 'CONSTANTS'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));
