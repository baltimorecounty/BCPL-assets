((app) => {
	'use strict';

	const cardService = ($location, $window, $injector) => {
		const get = (afterDataLoadedCallback, filterType) => {
			const dataService = $injector.get(`${filterType}Service`);

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
