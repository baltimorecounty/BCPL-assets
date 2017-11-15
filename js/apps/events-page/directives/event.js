((app) => {
	const eventDirective = (dateUtilityService, CONSTANTS) => {
		const eventLink = ($scope) => {
			const eventItem = $scope.eventItem;

			$scope.eventScheduleString =
				dateUtilityService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
		};

		const directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventTemplate,
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['dateUtilityService', 'CONSTANTS'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));
