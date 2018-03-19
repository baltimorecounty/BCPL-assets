(() => {
	'use strict';

	const app = angular.module('events', []);

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://oit226471:1919',
		serviceUrls: {
			events: '/api/evanced/signup/events',
			eventRegistration: '/api/evanced/signup/registration',
			eventTypes: '/api/evanced/signup/eventtypes'
		},
		remoteServiceUrls: {
			ageGroups: 'https://bcpl.evanced.info/api/signup/agegroups',
			locations: 'https://bcpl.evanced.info/api/signup/locations'
		},
		templateUrls: {
			datePickersTemplate: '/_js/apps/events-page/templates/datePickers.html',
			eventsListTemplate: '/_js/apps/events-page/templates/eventsList.html',
			filtersTemplate: '/_js/apps/events-page/templates/filters.html',
			filtersExpandosTemplate: '/_js/apps/events-page/templates/filters-expandos.html',
			loadMoreTemplate: '/_js/apps/events-page/templates/loadMore.html',
			featuredEventsTemplate: '/_js/apps/events-page/templates/featuredEvents.html'
		},
		partialUrls: {
			eventListPartial: '/_js/apps/events-page/partials/eventList.html',
			eventDetailsPartial: '/_js/apps/events-page/partials/eventDetails.html',
			eventRegistrationPartial: '/_js/apps/events-page/partials/eventRegistration.html'
		},
		requestChunkSize: 10
	};

	app.constant('events.CONSTANTS', constants);
})();
