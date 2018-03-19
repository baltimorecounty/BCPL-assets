((app) => {
	'use strict';

	const eventRequestService = () => {
		const build = () => {
			return '';
		};

		return {
			build
		};
	};

	app.factory('eventRequestService', eventRequestService);
})(angular.module('eventsPageApp'));
