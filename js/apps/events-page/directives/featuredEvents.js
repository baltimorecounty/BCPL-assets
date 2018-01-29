((app) => {
	'use strict';

	const featuredEventsDirective = (CONSTANTS) => {
		const directive = {
			restrict: 'E',
			scope: {
				resultsToDisplay: '=',
				branch: '=',
				eventType: '='
			},
			templateUrl: CONSTANTS.templateUrls.featuredEventsTemplate,
			controller: 'FeaturedEventsCtrl',
			controllerAs: 'featuredEvents',
			bindToController: true
		};

		return directive;
	};

	featuredEventsDirective.$inject = ['CONSTANTS'];

	app.directive('featuredEvents', featuredEventsDirective);
})(angular.module('eventsPageApp'));
