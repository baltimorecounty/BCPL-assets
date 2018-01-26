((app) => {
	'use strict';

	var constants = {
		templates: {
			databases: '/js/apps/filter-page/templates/card-databases.html',
			locations: '/js/apps/filter-page/templates/card-locations.html'
		},
		urls: {
			// databases: 'http://ba224964:3100/api/structured-content/databases',
			databases: 'http://testservices.bcpl.info/api/structured-content/databases',
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

	app.constant('bcpl.jobPostingsTableWidget.CONSTANTS', constants);
})(angular.module('bcpl.jobPostingsTableWidget'));
