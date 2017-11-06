((app) => {
	'use strict';

	const cardService = ($location, $window, $injector) => {
		const getFileNameWithoutExtension = (path) => {
			const pathParts = path.split('/');
			const lastPathPart = pathParts[pathParts.length - 1];
			const noExtension = lastPathPart.split('.')[0];
			return noExtension;
		};

		const get = (afterDataLoadedCallback) => {
			const filenameWithoutExtension = getFileNameWithoutExtension($window.location.pathname);
			const dataService = $injector.get(`${filenameWithoutExtension}Service`);

			dataService.get((data) => {
				const sortedData = _.sortBy(data, dataItem => dataItem.Title);
				afterDataLoadedCallback(sortedData);
			});
		};

		return {
			get
		};
	};

	cardService.$inject = ['$location', '$window', '$injector'];

	app.factory('cardService', cardService);
})(angular.module('filterPageApp'));
