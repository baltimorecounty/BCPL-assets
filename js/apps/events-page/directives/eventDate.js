((app) => {
	const eventDateDirective = () => {
		const eventDateLink = ($scope) => {
			const date = new Date($scope.eventGroup.date);
			const dateSettings = {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			$scope.date = date.toLocaleDateString('en-US', dateSettings);
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
