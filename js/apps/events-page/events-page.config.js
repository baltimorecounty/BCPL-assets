((app) => {
	'use strict';

	const config = ($locationProvider, $routeProvider, CONSTANTS) => {
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

	/**
	 * We're doing this to get around SiteExecutive's butchering of AngularJS URLs.
	 */
	const run = ($window, $location) => {
		const absoluteUrl = $location.absUrl();

		if (absoluteUrl.indexOf('#!') === -1 && absoluteUrl.indexOf('?') > -1) {
			const eventId = bcpl.utility.querystringer.getAsDictionary().eventid;

			if (eventId) {
				$window.location = eventId ?
					`/events-and-programs/list.html#!/${eventId}` :
					`/events-and-programs/list.html#!/${$window.location.search}`; // eslint-disable-line no-param-reassign
			}
		}
	};

	config.$inject = ['$locationProvider', '$routeProvider', 'events.CONSTANTS'];
	run.$inject = ['$window', '$location'];

	app
		.config(config)
		.run(run);
})(angular.module('eventsPageApp'));
