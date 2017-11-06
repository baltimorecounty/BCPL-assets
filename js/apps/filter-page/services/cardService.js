((app) => {
	'use strict';

	const cardService = ($location, $window, $injector) => {
		const generateFiltersList = (data) => {
			let filters = [];

			angular.forEach(data, (element) => {
				filters = filters.concat(element.attributes);
			});

			const uniqueFilters = _.uniq(filters);
			const cleanedFilters = uniqueFilters.filter((uniqueFilter) => {
				return uniqueFilter.trim().length > 0;
			});

			return cleanedFilters;
		};

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
				const filters = generateFiltersList(data);
				const sortedData = _.sortBy(data, dataItem => dataItem.name);
				afterDataLoadedCallback(filters, sortedData);
			});
		};

		return {
			get
		};
	};

	cardService.$inject = ['$location', '$window', '$injector'];

	app.factory('cardService', cardService);
})(angular.module('filterPageApp'));
