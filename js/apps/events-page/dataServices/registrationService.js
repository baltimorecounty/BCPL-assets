((app) => {
	'use strict';

	const registrationService = (CONSTANTS, $http, $q) => {
		const register = (registrationModel) => {
			return $q((resolve, reject) => {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.eventRegistration, registrationModel)
					.then((response) => {
						if (response.data) {
							resolve({
								data: response.data
							});
						} else {
							reject(response);
						}
					}, reject);
			});
		};

		return {
			register
		};
	};

	registrationService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('jobPostingsTableWidget', registrationService);
})(angular.module('jobPostingsTableWidget'));
