(() => {
	'use strict';

	const app = angular.module('sharedConstants', []);

	const constants = {
		urls: {
			getBranches: 'data/branch-amenities.json'
		}
	};

	app.constant('sharedConstants.CONSTANTS', constants);
})();
