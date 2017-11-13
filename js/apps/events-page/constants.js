((app) => {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://ba224964:3100',
		serviceUrls: {
			events: '/api/evanced/signup/events'
		},
		templateUrls: {
			event: '/dist/js/apps/events-page/templates/event.html',
			eventDate: '/dist/js/apps/events-page/templates/eventDate.html'
		},
		requestChunkSize: 25
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
