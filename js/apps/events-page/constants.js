((app) => {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://ba224964:3100',
		serviceUrls: {
			events: '/api/evanced/signup/events'
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
