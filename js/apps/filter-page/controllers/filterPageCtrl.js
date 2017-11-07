((app) => {
	'use strict';

	const FilterPageCtrl = function FilterPageCtrl($scope, cardService, filterService, $animate, $timeout) {
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
		const loadCardsAndFilters = (cardData) => {
			self.filters = filterService.build(cardData);
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

			const tags = _.pluck(cardDataItem.Tags, 'Tag');

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
			let foundFilterFamily = filterFamily;
			const isTagInfo = Object.prototype.hasOwnProperty.call(filter, 'Tag');
			const tagString = isTagInfo ? filter.Tag : filter;
			const filterIndex = self.activeFilters.indexOf(tagString);
			const shouldAddFilter = filterIndex === -1;

			if (isTagInfo) {
				foundFilterFamily = _.where(self.filters, { name: filter.Name });
				if (foundFilterFamily.length === 1) {
					foundFilterFamily = foundFilterFamily[0];
				}
			}

			const isPickOne = foundFilterFamily.type.toLowerCase() === 'one';
			let tagsToRemove = [];

			if (shouldAddFilter && isPickOne) {
				angular.forEach(foundFilterFamily.tags, (tag) => {
					if (tag !== tagString) {
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
				self.activeFilters.push(tagString);
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

	FilterPageCtrl.$inject = ['$scope', 'cardService', 'filterService', '$animate', '$timeout'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
