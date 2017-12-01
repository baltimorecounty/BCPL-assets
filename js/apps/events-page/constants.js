((app) => {
	'use strict';

	var constants = {
		baseUrl: 'https://testservices.bcpl.info',
		// baseUrl: 'http://ba224964:3100',
		serviceUrls: {
			events: '/api/evanced/signup/events'
		},
		remoteServiceUrls: {
			ageGroups: 'https://bcpl.evanced.info/api/signup/agegroups',
			eventTypes: 'https://bcpl.evanced.info/api/signup/eventtypes',
			locations: 'https://bcpl.evanced.info/api/signup/locations'
		},
		templateUrls: {
			datePickersTemplate: '/js/apps/events-page/templates/datePickers.html',
			eventsListTemplate: '/js/apps/events-page/templates/eventsList.html',
			filtersTemplate: '/js/apps/events-page/templates/filters.html',
			filtersExpandosTemplate: '/js/apps/events-page/templates/filters-expandos.html',
			loadMoreTemplate: '/js/apps/events-page/templates/loadMore.html'
		},
		requestChunkSize: 10
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
