((app) => {
	const eventDateDirective = () => {
		const eventDateLink = ($scope) => {
			const dateSettings = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			$scope.date = $scope.eventGroup.date.toLocaleDateString('en-US', dateSettings);
			$scope.events = $scope.eventGroup.events;
			$scope.id = 'datebar-' + $scope.date.replace(' ', '-');

			if ($scope.$last) {
				$('.event-date-bar').sticky({
					zIndex: 100,
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
