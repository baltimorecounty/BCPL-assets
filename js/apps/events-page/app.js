(() => {
	'use strict';

	angular.module('eventsPageApp', ['ngAnimate', 'ngRoute'])
		.config(function appConfig($routeProvider, CONSTANTS) {
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
		});
})();
