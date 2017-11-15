((app) => {
	'use strict';

	var constants = {
		templates: {
			databases: '/dist/js/apps/filter-page/templates/card-databases.html',
			locations: '/dist/js/apps/filter-page/templates/card-locations.html'
		},
		urls: {
			databases: 'http://ba224964:3100/api/structured-content/databases',
			// databases: 'http://testservices.bcpl.info/api/structured-content/databases',
			locations: '/mockups/data/branch-amenities.json'
		},
		filters: {
			tags: {
				types: {
					pickOne: 'one',
					pickMany: 'many'
				}
			}
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('filterPageApp'));
