((app) => {
	'use strict';

	const cardVisibilityFilter = (tagParsingService) => {
		return (cards, activeFilters) => {
			let filtered = [];

			angular.forEach(cards, (card) => {
				let matches = 0;

				angular.forEach(card.attributes, (attribute) => {
					if (activeFilters.indexOf(tagParsingService.extractTagName(attribute)) !== -1) {
						matches += 1;
					}
				});

				if (matches === activeFilters.length) {
					filtered.push(card);
				}
			});

			return filtered;
		};
	};

	cardVisibilityFilter.$inject = ['tagParsingService'];

	app.filter('cardVisibilityFilter', cardVisibilityFilter);


	const FilterPageCtrl = function FilterPageCtrl(cardService, tagParser, $animate, $timeout) {
		const self = this;

		self.activeFilters = [];
		self.allCardData = {};
		self.isEverythingFilteredOut = false;

		/**
		 * Makes sure the filters and tags are in sync.
		 *
		 * @param {string} filter
		 */
		self.setFilter = (filter, filterFamily) => {
			const $resultsDisplay = angular.element('#results-display');

			setActiveFilters(filter, filterFamily);
			$animate.addClass($resultsDisplay, 'fade-out');
			self.items = self.allCardData.filter(filterDataItems);
			$resultsDisplay.trigger('bcpl.filter.changed', { items: self.items });
			bcpl.utility.windowShade.cycle(250, 2000);
			$timeout(() => {
				$animate.removeClass($resultsDisplay, 'fade-out');
			}, 250);
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

			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};
		const transformAttributesToTags = (cardDataItem) => {
			const attributes = cardDataItem.attributes;
			let tags = [];

			attributes.forEach((attribute) => {
				tags.push(tagParser.extractTagName(attribute));
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

			angular.forEach(self.activeFilters, (activeFilter) => {
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
		const setActiveFilters = (filter, filterFamily) => {
			const filterIndex = self.activeFilters.indexOf(filter);
			const shouldAddFilter = filterIndex === -1;
			const isPickOne = filterFamily.type.trim().toLowerCase() === 'one';
			let tagsToRemove = [];

			if (shouldAddFilter && isPickOne) {
				angular.forEach(filterFamily.tags, (tag) => {
					if (tag !== filter) {
						tagsToRemove.push(tag);
					}
				});
			}

			angular.forEach(tagsToRemove, (tagToRemove) => {
				self.activeFilters.splice(self.activeFilters.indexOf(tagToRemove), 1);
			});

			if (shouldAddFilter) {
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

	FilterPageCtrl.$inject = ['cardService', 'tagParsingService', '$animate', '$timeout'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
