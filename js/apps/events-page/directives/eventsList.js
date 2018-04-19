((app) => {
	'use strict';

	const eventsListDirective = ($timeout, CONSTANTS, dateUtilityService, ageDisclaimerService) => {
		const eventsListLink = (scope) => {
			const innerScope = scope;

			const dateSettings = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			innerScope.eventScheduleString = (eventItem) =>
				dateUtilityService.formatSchedule(eventItem, eventItem.EventLength, eventItem.AllDay);

			innerScope.getDisplayDate = (eventGroup) => eventGroup.date.toLocaleDateString('en-US', dateSettings);

			innerScope.shouldShowDisclaimer = ageDisclaimerService.shouldShowDisclaimer;

			innerScope.disclaimer = CONSTANTS.ageDisclaimer.message;
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

	eventsListDirective.$inject = ['$timeout', 'events.CONSTANTS', 'dateUtilityService', 'ageDisclaimerService'];

	app.directive('eventsList', eventsListDirective);
})(angular.module('eventsPageApp'));
