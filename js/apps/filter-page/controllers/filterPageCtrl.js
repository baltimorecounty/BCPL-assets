((app) => {
	'use strict';

	const FilterPageCtrl = function FilterPageCtrl($scope, cardService, tagParsingService) {
		const self = this;

		self.activeFilters = [];
		self.allCardData = {};

		/**
		 * Makes sure the filters and tags are in sync.
		 *
		 * @param {string} filter
		 */
		self.setFilter = (filter) => {
			setActiveFilters(filter);
			self.items = self.allCardData.filter(filterDataItems);
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};

		/* Private */

		/**
		 * Loads up the list of filters and all of the branch data.
		 *
		 * @param {[string]} filters
		 * @param {[*]} branchData
		 */
		const loadCardsAndFilters = (filters, cardData) => {
			self.filters = filters;
			self.allCardData = cardData;
			self.items = cardData;
			$scope.$apply();

			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};

		const transformAttributesToTags = (cardDataItem) => {
			const attributes = cardDataItem.attributes;
			let tags = [];

			attributes.forEach((attribute) => {
				tags.push(tagParsingService.extractTagName(attribute));
			});

			return tags;
		};

		/**
		 * Allows for multiple-filter matches by verifying an active branch has
		 * "all" active filters, and not just "any" active filters.
		 *
		 * @param {*} dataItem
		 */
		const filterDataItems = (cardDataItem) => {
			let matchCount = 0;

			if (!cardDataItem) return false;

			const tags = transformAttributesToTags(cardDataItem);

			angular.element.each(self.activeFilters, (index, activeFilter) => {
				if (tags.indexOf(activeFilter) !== -1) {
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

		cardService.get(loadCardsAndFilters);

		/* test-code */
		self.setActiveFilters = setActiveFilters;
		self.filterDataItems = filterDataItems;
		/* end-test-code */
	};

	FilterPageCtrl.$inject = ['$scope', 'cardService', 'tagParsingService'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
