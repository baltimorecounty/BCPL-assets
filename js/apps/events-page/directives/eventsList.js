((app) => {
	const eventsListDirective = ($timeout, CONSTANTS, dateUtilityService) => {
		const eventsListLink = (scope) => {
			const innerScope = scope;

			const dateSettings = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			innerScope.eventScheduleString = (eventItem) =>
				dateUtilityService.formatSchedule(eventItem.EventStart, eventItem.EventLength);

			innerScope.getDisplayDate = (eventGroup) => eventGroup.date.toLocaleDateString('en-US', dateSettings);
		};

		const directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventsListTemplate,
			link: eventsListLink,
			scope: {
				eventGroups: '='
			}
		};

		return directive;
	};

	eventsListDirective.$inject = ['$timeout', 'CONSTANTS', 'dateUtilityService'];

	app.directive('eventsList', eventsListDirective);
})(angular.module('eventsPageApp'));
