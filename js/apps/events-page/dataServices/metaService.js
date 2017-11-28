((app) => {
	'use strict';

	const metaService = ($http, $q) => {
		const request = (endpointUrl) => {
			return $q((resolve, reject) => {
				$http.get(endpointUrl)
					.then((response) => {
						resolve(response.data);
					}, (err) => {
						reject(err);
					});
			});
		};

		return {
			request
		};
	};

	metaService.$inject = ['$http', '$q'];

	app.factory('metaService', metaService);
})(angular.module('eventsPageApp'));
