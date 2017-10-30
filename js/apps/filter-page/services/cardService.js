((app) => {
	'use strict';

	const cardService = ($location, $injector) => {
		const generateFiltersList = (data) => {
			let filters = [];

			angular.forEach(data, (element) => {
				filters = filters.concat(element.attributes);
			});

			const uniqueFilters = _.uniq(filters);
			const sortedUniqueFilters = _.sortBy(uniqueFilters, uniqueFilter => uniqueFilter);

			return sortedUniqueFilters;
		};

		const getFileNameWithoutExtension = (path) => {
			const pathParts = path.split('/');
			const lastPathPart = pathParts[pathParts.length - 1];
			const noExtension = lastPathPart.split('.')[0];
			return noExtension;
		};

		const get = (afterDataLoadedCallback) => {
			const filenameWithoutExtension = getFileNameWithoutExtension(window.location.pathname);
			const dataService = $injector.get(`${filenameWithoutExtension}Service`);

			dataService.get((data) => {
				const filters = generateFiltersList(data);
				afterDataLoadedCallback(filters, data);
			});
		};

		return {
			get
		};
	};

	cardService.$inject = ['$location', '$injector'];

	app.factory('cardService', cardService);
})(angular.module('filterPageApp'));
