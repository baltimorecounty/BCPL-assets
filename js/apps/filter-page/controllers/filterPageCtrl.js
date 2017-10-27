(() => {
	'use strict';

	const filterPageCtrl = function filterPageCtrl($scope, dataLoaderService) {
		const self = this;

		self.activeFilters = [];
		self.allData = {};

		self.setFilter = (filter) => {
			setActiveFilters(filter);
			self.items = self.allData.filter(filterDataItems);
			angular.element('#results-display').trigger('bcpl.filter.changed', self.items);
		};

		dataLoaderService.load(bcpl.pageSpecific.branchesFilter, (filters, data) => {
			self.filters = filters;
			self.allData = data;
			self.items = data;
			$scope.$apply();
		});

		/* Private */

		const filterDataItems = (dataItem) => {
			let matchCount = 0;

			angular.element.each(self.activeFilters, (index, activeFilter) => {
				if (dataItem.attributes.indexOf(activeFilter) !== -1) {
					matchCount += 1;
				}
			});

			return matchCount === self.activeFilters.length;
		};

		const setActiveFilters = (filter) => {
			const filterIndex = self.activeFilters.indexOf(filter);

			if (filterIndex === -1) {
				self.activeFilters.push(filter);
			} else {
				self.activeFilters.splice(filterIndex, 1);
			}
		};
	};

	filterPageCtrl.$inject = ['$scope', 'dataLoaderService'];

	angular
		.module('filterPageApp')
		.controller('filterPageCtrl', filterPageCtrl);
})();
