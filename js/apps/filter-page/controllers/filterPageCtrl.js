((app) => {
	'use strict';

	const FilterPageCtrl = function FilterPageCtrl($scope, cardService, tagParser, $animate, $timeout) {
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
			$scope.$apply();
		};

		const transformAttributesToTags = (cardDataItem) => {
			const attributes = cardDataItem.attributes;
			let tags = [];

			attributes.forEach((attribute) => {
				const tagName = tagParser.extractTagName(attribute);
				if (tagName.length > 0) {
					tags.push(tagName);
				}
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
				const isFound = self.activeFilters.indexOf(tagToRemove) !== -1;

				if (isFound) {
					self.activeFilters.splice(self.activeFilters.indexOf(tagToRemove), 1);
				}
			});

			if (shouldAddFilter) {
				self.activeFilters.push(filter);
			} else {
				self.activeFilters.splice(filterIndex, 1);
			}
		};

		const showFilters = (collapseEvent) => {
			const $collapsible = angular.element(collapseEvent.currentTarget);
			const $collapseControl = $collapsible.siblings('.collapse-control');

			$collapseControl.html('<i class="fa fa-minus"></i> Hide Filters');
		};

		const hideFilters = (collapseEvent) => {
			const $collapsible = angular.element(collapseEvent.currentTarget);
			const $collapseControl = $collapsible.siblings('.collapse-control');

			$collapseControl.html('<i class="fa fa-plus"></i> Show Filters');
		};

		/* init */

		cardService.get(loadCardsAndFilters);

		angular.element(document).on('show.bs.collapse', '#filters', showFilters);
		angular.element(document).on('hide.bs.collapse', '#filters', hideFilters);

		/* test-code */
		self.setActiveFilters = setActiveFilters;
		self.filterDataItems = filterDataItems;
		/* end-test-code */
	};

	FilterPageCtrl.$inject = ['$scope', 'cardService', 'tagParsingService', '$animate', '$timeout'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
