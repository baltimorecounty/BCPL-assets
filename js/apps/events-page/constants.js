((app) => {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://ba224964:3100',
		serviceUrls: {
			events: '/api/evanced/signup/events'
		},
		remoteServiceUrls: {
			ageGroups: 'https://bcpl.evanced.info/api/signup/agegroups',
			eventTypes: 'https://bcpl.evanced.info/api/signup/eventtypes',
			locations: 'https://bcpl.evanced.info/api/signup/locations'
		},
		templateUrls: {
			datePickersTemplate: '/dist/js/apps/events-page/templates/datePickers.html',
			eventsListTemplate: '/dist/js/apps/events-page/templates/eventsList.html',
			loadMoreTemplate: '/dist/js/apps/events-page/templates/loadMore.html'
		},
		requestChunkSize: 10
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
