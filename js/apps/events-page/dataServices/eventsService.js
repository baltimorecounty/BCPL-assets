((app) => {
	const eventsService = (CONSTANTS, querystringService) => {
		const get = (startDate, endDate, take, page, successCallback, errorCallback) => {
			const querystringSettings = {
				startDate,
				endDate,
				take,
				page
			};

			const querystring = querystringService.build(querystringSettings);

			$.ajax(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events + '?' + querystring)
				.done(successCallback)
				.fail(errorCallback);
		};

		return {
			get
		};
	};

	eventsService.$inject = ['CONSTANTS', 'querystringService'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
