((app) => {
	'use strict';

	var constants = {
		templates: {
			databases: '/dist/js/apps/filter-page/templates/card-databases.html',
			locations: '/dist/js/apps/filter-page/templates/card-locations.html'
		},
		urls: {
			// databases: '/mockups/data/bcpl-databases.html',
			// databases: '/_structured-content/BCPL_Databases',
			databases: 'http://ba224964:1000/api/bcpl/databases',
			locations: '/mockups/data/branch-amenities.json'
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('filterPageApp'));
