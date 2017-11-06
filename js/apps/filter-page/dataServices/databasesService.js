((app) => {
	const databasesService = (CONSTANTS) => {
		const get = (successCallback, errorCallback) => {
			$.ajax(CONSTANTS.urls.databases)
				.done(successCallback)
				.fail(errorCallback);
		};

		return {
			get
		};
	};

	databasesService.$inject = ['CONSTANTS'];

	app.factory('databasesService', databasesService);
})(angular.module('filterPageApp'));
