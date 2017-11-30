(() => {
	'use strict';

	angular.module('eventsPageApp', ['ngAnimate', 'ngRoute'])
		.config(function appConfig($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: '/js/apps/events-page/partials/eventList.html',
					controller: 'EventsPageCtrl',
					controllerAs: 'eventsPage'
				})
				.when('/:id', {
					templateUrl: '/js/apps/events-page/partials/eventDetails.html',
					controller: 'EventDetailsCtrl',
					controllerAs: 'eventDetailsPage'
				});
		});
})();
