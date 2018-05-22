((app, addthis) => {
	'use strict';

	const addthisService = ($window) => {

		const update = (url, title) => {
			if ($window.addthis) { // ensure the app gracefully fails in the case that addthis doesn't exist
				updateUrl(url);
				updateTitle(title);
			}
		};

		const updateUrl = (url) => {
			$window.addthis.update('share', 'url', url);
		};

		const updateTitle = (title) => {
			$window.addthis.update('share', 'title', title);
		};

		return {
			update
		};
	};

	addthisService.$inject = ['$window'];

	app.factory('addthisService', addthisService);


})(angular.module('eventsPageApp'));
