((app) => {
	const eventDateDirective = () => {
		const eventDateLink = ($scope, eventDateElement) => {
			const date = new Date($scope.eventGroup.date);
			const dateSettings = {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			$scope.date = date.toLocaleDateString('en-US', dateSettings);
			$scope.events = $scope.eventGroup.events;
			$scope.id = 'datebar-' + $scope.eventGroup.date;

			if ($scope.$last) {
				$('.event-date-bar').sticky({
					zIndex: 100,
					getWidthFrom: 'body',
					responsiveWidth: true
				});
			}
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
