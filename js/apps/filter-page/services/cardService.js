(() => {
	'use strict';

	const cardService = () => {
		const generateFiltersList = (data) => {
			let filters = [];

			angular.forEach(data, (element) => {
				filters = filters.concat(element.attributes);
			});

			const uniqueFilters = _.uniq(filters);
			const sortedUniqueFilters = _.sortBy(uniqueFilters, uniqueFilter => uniqueFilter);

			return sortedUniqueFilters;
		};

		const get = (dataLoaderNameSpace, afterDataLoadedCallback) => {
			dataLoaderNameSpace.dataLoader((data) => {
				const filters = generateFiltersList(data);
				afterDataLoadedCallback(filters, data);
			});
		};

		return {
			get
		};
	};

	cardService.$inject = [];

	angular
		.module('filterPageApp')
		.factory('cardService', cardService);
})();
