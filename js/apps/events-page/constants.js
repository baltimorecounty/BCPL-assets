((app) => {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://ba224964:3100',
		serviceUrls: {
			events: '/api/evanced/signup/events'
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
