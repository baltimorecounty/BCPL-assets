((app) => {
	'use strict';

	const FilterPageCtrl = function FilterPageCtrl($location, $scope, cardService, filterService, $animate, $timeout, CONSTANTS) {
		const vm = this;

		vm.activeFilters = [];
		vm.allCardData = {};
		vm.isEverythingFilteredOut = false;

		/**
		 * Makes sure the filters and tags are in sync.
		 *
		 * @param {string} filter
		 */
		vm.setFilter = (filter, filterFamily) => {
			setActiveFilters(filter, filterFamily);
			cycleDisplay();
		};

		vm.clearFilters = () => {
			vm.activeFilters = [];
			cycleDisplay();
		};

		/* Private */

		const cycleDisplay = () => {
			const resultsDisplayElement = document.getElementById('results-display');
			$animate.addClass(resultsDisplayElement, 'fade-out');
			vm.items = vm.allCardData.filter(filterDataItems);
			angular.element(resultsDisplayElement).trigger('bcpl.filter.changed', { items: vm.items });
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

			vm.filters = filterService.build(taggedCardData);
			vm.allCardData = taggedCardData;
			vm.items = taggedCardData;
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: vm.items });
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

			angular.forEach(vm.activeFilters, (activeFilter) => {
				if (tags.indexOf(activeFilter) !== -1) {
					matchCount += 1;
				}
			});

			return matchCount === vm.activeFilters.length;
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
			const filterIndex = vm.activeFilters.indexOf(tagString);
			const shouldAddFilter = filterIndex === -1;
			let foundFilterFamily = filterFamily;

			if (isTagInfo) {
				foundFilterFamily = _.where(vm.filters, { name: filter.Name });
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
				const isFound = vm.activeFilters.indexOf(tagToRemove) !== -1;

				if (isFound) {
					vm.activeFilters.splice(vm.activeFilters.indexOf(tagToRemove), 1);
				}
			});

			if (shouldAddFilter) {
				vm.activeFilters.push(tagString);
			} else {
				vm.activeFilters.splice(filterIndex, 1);
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

		const formatKeyName = (key) => !key ? "" : key.replace(/-/g, " ");

		const getFilterFamily = (key) => {
			const formattedKeyName = formatKeyName(key);
			const filterFamliy = vm.filters.filter((filter) => {
				return formattedKeyName.toLowerCase() === filter.name.toLowerCase();
			});

			return filterFamliy.length ? filterFamliy[0] : null;
		};

		const getFiltersFromString = (filterStr) => {
			if(!filterStr) return [];

			const containsMultipleFilters = filterStr && filterStr.indexOf(',') > -1;

			return containsMultipleFilters ?  filterStr.split(',') : [filterStr];
		};

		const setFiltersBasedOnQueryParams = () => {
			const queryParams = $location.search();

			Object.keys(queryParams).forEach((key) => {
				const filterStr = queryParams[key];
				const filters = getFiltersFromString(filterStr);
				const filterFamily = getFilterFamily(key);

				filters.forEach((filter) => {
					setActiveFilters(filter, filterFamily);
				});
			});
		};

		const init = () => {
			cardService
				.get((data) => {
					loadCardsAndFilters(data);
					setFiltersBasedOnQueryParams();
				});
		};

		/* test-code */
		vm.getFilterFamily = getFilterFamily;
		vm.getFiltersFromString = getFiltersFromString;
		vm.filterDataItems = filterDataItems;
		vm.formatKeyName = formatKeyName;
		vm.setActiveFilters = setActiveFilters;
		/* end-test-code */

		init();
	};

	FilterPageCtrl.$inject = ['$location', '$scope', 'cardService', 'filterService', '$animate', '$timeout', 'CONSTANTS'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
