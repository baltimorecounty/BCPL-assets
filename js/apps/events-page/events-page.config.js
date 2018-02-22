((app) => {
	'use strict';

	const config = ($routeProvider, CONSTANTS) => {
		$routeProvider
			.when('/', {
				templateUrl: CONSTANTS.partialUrls.eventListPartial,
				controller: 'EventsPageCtrl',
				controllerAs: 'eventsPage',
				reloadOnSearch: false
			})
			.when('/:id', {
				templateUrl: CONSTANTS.partialUrls.eventDetailsPartial,
				controller: 'EventDetailsCtrl',
				controllerAs: 'eventDetailsPage'
			})
			.when('/register/:id', {
				templateUrl: CONSTANTS.partialUrls.eventRegistrationPartial,
				controller: 'EventRegistrationCtrl',
				controllerAs: 'eventRegistrationPage'
			});
	};

	config.$inject = ['$routeProvider', 'events.CONSTANTS'];

	app.config(config);
})(angular.module('eventsPageApp'));
