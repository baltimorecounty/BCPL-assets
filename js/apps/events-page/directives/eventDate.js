((app) => {
	const eventDateDirective = (CONSTANTS) => {
		const eventDateLink = ($scope) => {
			const dateSettings = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			const eventDateBarStickySettings = {
				zIndex: 100,
				responsiveWidth: true
			};

			$scope.date = $scope.eventGroup.date.toLocaleDateString('en-US', dateSettings);
			$scope.events = $scope.eventGroup.events;
			$scope.id = 'datebar-' + $scope.date.replace(' ', '-');

			if ($scope.$last) {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			}
		};

		const directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventDate,
			link: eventDateLink
		};

		return directive;
	};

	eventDateDirective.$inject = ['CONSTANTS'];

	app.directive('eventDate', eventDateDirective);
})(angular.module('eventsPageApp'));
