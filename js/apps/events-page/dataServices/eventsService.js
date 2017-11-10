((app) => {
	const eventsService = (CONSTANTS, $http, querystringService) => {
		const get = (eventRequestModel, successCallback, errorCallback) => {
			const querystring = querystringService.build(eventRequestModel);

			$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel)
				.then(successCallback, errorCallback);
		};

		return {
			get
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', 'querystringService'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
