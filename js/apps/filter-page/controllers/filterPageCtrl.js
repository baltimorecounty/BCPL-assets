(() => {
	'use strict';

	const filterPageCtrl = function filterPageCtrl($scope, dataLoaderService) {
		const self = this;

		dataLoaderService.load(bcpl.pageSpecific.databaseFilter, (filters, data) => {
			self.filters = filters;
			self.items = data;
			$scope.$apply();
		});
	};

	filterPageCtrl.$inject = ['$scope', 'dataLoaderService'];

	angular
		.module('filterPageApp')
		.controller('filterPageCtrl', filterPageCtrl);
})();
