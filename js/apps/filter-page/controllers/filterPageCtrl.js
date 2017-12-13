((app) => {
	'use strict';

	const FilterPageCtrl = function FilterPageCtrl($scope, cardService, filterService, $animate, $timeout, CONSTANTS) {
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
			setActiveFilters(filter, filterFamily);
			cycleDisplay();
		};

		self.clearFilters = () => {
			self.activeFilters = [];
			cycleDisplay();
		};

		/* Private */

		const cycleDisplay = () => {
			const resultsDisplayElement = document.getElementById('results-display');
			$animate.addClass(resultsDisplayElement, 'fade-out');
			self.items = self.allCardData.filter(filterDataItems);
			angular.element(resultsDisplayElement).trigger('bcpl.filter.changed', { items: self.items });
			bcpl.utility.windowShade.cycle(250, 2000);
			$timeout(() => {
				$animate.removeClass(resultsDisplayElement, 'fade-out');
			}, 250);
		};

		/**
		 * Loads up the list of filters and all of the branch data.
		 *
		 * @param {[string]} filters
		 * @param {[*]} branchData
		 */
		const loadCardsAndFilters = (cardData) => {
			if (!cardData.length) { return; }

			const taggedCardData = Object.prototype.hasOwnProperty.call(cardData[0], 'Tags') ? cardData : filterService.transformAttributesToTags(cardData);

			self.filters = filterService.build(taggedCardData);
			self.allCardData = taggedCardData;
			self.items = taggedCardData;
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
			$scope.$apply();
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
			const isTagInfo = Object.prototype.hasOwnProperty.call(filter, 'Tag');
			const tagString = isTagInfo ? filter.Tag : filter;
			const filterIndex = self.activeFilters.indexOf(tagString);
			const shouldAddFilter = filterIndex === -1;
			let foundFilterFamily = filterFamily;

			if (isTagInfo) {
				foundFilterFamily = _.where(self.filters, { name: filter.Name });
				if (foundFilterFamily.length === 1) {
					foundFilterFamily = foundFilterFamily[0];
				}
			}

			const isPickOne = foundFilterFamily.type ?
				foundFilterFamily.type.toLowerCase() === CONSTANTS.filters.tags.types.pickOne :
				false;

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

		const toggleIcon = (collapseEvent) => {
			const $collapsible = angular.element(collapseEvent.currentTarget);
			const $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		/* init */
		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		cardService.get(loadCardsAndFilters);

		/* test-code */
		self.setActiveFilters = setActiveFilters;
		self.filterDataItems = filterDataItems;
		/* end-test-code */
	};

	FilterPageCtrl.$inject = ['$scope', 'cardService', 'filterService', '$animate', '$timeout', 'CONSTANTS'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
