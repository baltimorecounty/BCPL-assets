((app) => {
	const locationsService = (CONSTANTS) => {
		const get = (externalSuccessCallback, externalErrorCallback) => {
			$.ajax(CONSTANTS.urls.locations)
				.done((data) => {
					internalSuccessCallback(data, externalSuccessCallback);
				})
				.fail(externalErrorCallback);
		};

		const internalSuccessCallback = (data, externalSuccessCallback) => {
			const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

			externalSuccessCallback(parsedData);
		};

		return {
			get
		};
	};

	locationsService.$inject = ['CONSTANTS'];

	app.factory('locationsService', locationsService);
})(angular.module('filterPageApp'));
