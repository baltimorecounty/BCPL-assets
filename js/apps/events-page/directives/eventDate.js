((app) => {
	const eventDateDirective = (CONSTANTS) => {
		const eventDateLink = (scope) => {
			const innerScope = scope;

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

			innerScope.date = innerScope.eventGroupDisplay.date.toLocaleDateString('en-US', dateSettings);
			innerScope.events = innerScope.eventGroupDisplay.events;
			innerScope.id = 'datebar-' + innerScope.date.replace(' ', '-');

			/* scope.$watch('eventGroupDisplay', (newVal, oldVal) => {
				// console.log(newVal);
			}); */

			if (scope.$last) {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			}
		};

		const directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventDate,
			link: eventDateLink,
			scope: {
				eventGroupDisplay: '='
			}
		};

		return directive;
	};

	eventDateDirective.$inject = ['CONSTANTS'];

	app.directive('eventDate', eventDateDirective);
})(angular.module('eventsPageApp'));
