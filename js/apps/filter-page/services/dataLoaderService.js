(() => {
	'use strict';

	const dataLoaderService = () => {
		const generateFiltersList = (data) => {
			let filters = [];

			angular.forEach(data, (element) => {
				filters = filters.concat(element.attributes);
			});

			const uniqueFilters = _.uniq(filters);
			const sortedUniqueFilters = _.sortBy(uniqueFilters, uniqueFilter => uniqueFilter);

			return sortedUniqueFilters;
		};

		const load = (dataLoaderNameSpace, afterDataLoadedCallback) => {
			dataLoaderNameSpace.dataLoader((data) => {
				const filters = generateFiltersList(data);
				afterDataLoadedCallback(filters, data);
			});
		};

		return {
			load
		};
	};

	dataLoaderService.$inject = [];

	angular
		.module('filterPageApp')
		.factory('dataLoaderService', dataLoaderService);
})();
