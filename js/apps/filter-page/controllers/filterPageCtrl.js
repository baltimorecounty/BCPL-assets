(() => {
	'use strict';

	const filterPageCtrl = function filterPageCtrl($scope, dataLoaderService) {
		const self = this;

		self.activeFilters = [];
		self.allData = {};

		/**
		 * Makes sure the filters and tags are in sync.
		 *
		 * @param {string} filter
		 */
		self.setFilter = (filter) => {
			setActiveFilters(filter);
			self.items = self.allData.filter(filterDataItems);
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};

		/* Private */

		/**
		 * Loads up the list of filters and all of the branch data.
		 *
		 * @param {[string]} filters
		 * @param {[*]} branchData
		 */
		const loadDataFromService = (filters, branchData) => {
			self.filters = filters;
			self.allData = branchData;
			self.items = branchData;
			$scope.$apply();

			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};

		/**
		 * Allows for multiple-filter matches by verifying an active branch has
		 * "all" active filters, and not just "any" active filters.
		 *
		 * @param {*} dataItem
		 */
		const filterDataItems = (dataItem) => {
			let matchCount = 0;

			angular.element.each(self.activeFilters, (index, activeFilter) => {
				if (dataItem.attributes.indexOf(activeFilter) !== -1) {
					matchCount += 1;
				}
			});

			return matchCount === self.activeFilters.length;
		};

		/**
		 * Toggles filters in the master filter list since there are multiple
		 * ways of setting a filter (tags or filter list).
		 *
		 * @param {*} filter
		 */
		const setActiveFilters = (filter) => {
			const filterIndex = self.activeFilters.indexOf(filter);

			if (filterIndex === -1) {
				self.activeFilters.push(filter);
			} else {
				self.activeFilters.splice(filterIndex, 1);
			}
		};

		/* init */

		dataLoaderService.load(bcpl.pageSpecific.branchesFilter, loadDataFromService);
	};

	filterPageCtrl.$inject = ['$scope', 'dataLoaderService'];

	angular
		.module('filterPageApp')
		.controller('filterPageCtrl', filterPageCtrl);
})();
