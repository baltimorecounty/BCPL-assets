(() => {
	'use strict';

	angular.module('eventsPageApp', ['ngAnimate', 'ngRoute'])
		.config(function appConfig($routeProvider, $locationProvider) {
			$routeProvider
				.when('/dist/events.html', {
					templateUrl: '/dist/js/apps/events-page/partials/eventList.html',
					controller: 'EventsPageCtrl',
					controllerAs: 'eventsPage'
				})
				.when('/dist/events.html/:id', {
					templateUrl: '/dist/js/apps/events-page/partials/eventDetails.html',
					controller: 'EventDetailsCtrl',
					controllerAs: 'eventDetailsPage'
				});

			$locationProvider.html5Mode(true);
		});
})();
