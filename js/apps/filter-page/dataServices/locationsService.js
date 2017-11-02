((app) => {
	const locationsService = (CONSTANTS) => {
		const get = (externalSuccessCallback, externalErrorCallback) => {
			$.ajax(CONSTANTS.urls.locations)
				.done(externalSuccessCallback)
				.fail(externalErrorCallback);
		};

		return {
			get
		};
	};

	locationsService.$inject = ['CONSTANTS'];

	app.factory('locationsService', locationsService);
})(angular.module('filterPageApp'));
