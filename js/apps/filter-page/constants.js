((app) => {
	'use strict';

	var constants = {
		templates: {
			databases: '/_js/apps/filter-page/templates/card-databases.html',
			locations: '/_js/apps/filter-page/templates/card-locations.html',
			filter: '/_js/apps/filter-page/templates/filter.html',
			filters: '/_js/apps/filter-page/templates/filters.html',
			tag: '/_js/apps/filter-page/templates/tag.html'
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
