((app) => {
	'use strict';

	var constants = {
		templates: {
			databases: '/js/apps/filter-page/templates/card-databases.html',
			locations: '/js/apps/filter-page/templates/card-locations.html'
		},
		urls: {
			databases: 'https://services.bcpl.info/api/structured-content/databases',
			locations: '/sebin/q/r/branch-amenities.json'
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
