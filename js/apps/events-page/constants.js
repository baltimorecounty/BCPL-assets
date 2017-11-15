((app) => {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://ba224964:3100',
		serviceUrls: {
			events: '/api/evanced/signup/events'
		},
		templateUrls: {
			eventTemplate: '/dist/js/apps/events-page/templates/event.html',
			eventDateTemplate: '/dist/js/apps/events-page/templates/eventDate.html',
			loadMoreTemplate: '/dist/js/apps/events-page/templates/loadMore.html'
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
