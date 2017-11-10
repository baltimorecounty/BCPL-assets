((app) => {
	const eventDateDirective = () => {
		const eventDateLink = ($scope) => {
			$scope.date = $scope.eventGroup.date;
			$scope.events = $scope.eventGroup.events;
		};

		const directive = {
			restrict: 'E',
			templateUrl: '/dist/js/apps/events-page/templates/eventDate.html',
			link: eventDateLink
		};

		return directive;
	};

	app.directive('eventDate', eventDateDirective);
})(angular.module('eventsPageApp'));
