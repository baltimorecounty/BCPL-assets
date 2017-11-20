((app) => {
	const metaService = ($http, $q, CONSTANTS) => {
		const getAgeGroups = () => {
			return request(CONSTANTS.remoteServiceUrls.ageGroups);
		};

		const getEventTypes = () => {
			return request(CONSTANTS.remoteServiceUrls.ageGroups);
		};

		const getLocations = () => {
			return request(CONSTANTS.remoteServiceUrls.ageGroups);
		};

		const request = (url) => {
			return $q((resolve, reject) => {
				$http.get(url)
					.then((response) => {
						resolve(response.data);
					}, (err) => {
						reject(err);
					});
			});
		};

		return {
			getAgeGroups,
			getEventTypes,
			getLocations
		};
	};

	metaService.$inject = ['$http', '$q', 'CONSTANTS'];

	app.factory('metaService', metaService);
})(angular.module('eventsPageApp'));
