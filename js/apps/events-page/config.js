((app) => {
	'use strict';

	const config = ($routeProvider, CONSTANTS) => {
		$routeProvider
			.when('/', {
				templateUrl: CONSTANTS.partialUrls.eventListPartial,
				controller: 'EventsPageCtrl',
				controllerAs: 'eventsPage'
			})
			.when('/:id', {
				templateUrl: CONSTANTS.partialUrls.eventDetailsPartial,
				controller: 'EventDetailsCtrl',
				controllerAs: 'eventDetailsPage'
			});			
	};

	config.$inject = ['$routeProvider', 'CONSTANTS'];

	app.config(config);
})(angular.module('eventsPageApp'));
