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
			updateLocation(filter, filterFamily);
			cycleDisplay();
		};

		vm.clearFilters = () => {
			vm.activeFilters = [];
			clearQueryPararms();
			cycleDisplay();
		};

		/* Private */

		const buildFilterQueryString = (targetQueryParam, filterVal) => {
			const queryParamHasValue = Object.hasOwnProperty.call(targetQueryParam, 'val') && targetQueryParam.val;
			const doesQueryParamMatchFilter = queryParamHasValue ? 
				targetQueryParam.val.toLowerCase().indexOf(filterVal.toLowerCase()) > -1 : 
				false;
			
			if (doesQueryParamMatchFilter) {
				const doesQueryHaveMultipleValues = queryParamHasValue ? 
					targetQueryParam.val.indexOf(',') > -1 : 
					false;

				if (!doesQueryHaveMultipleValues) return null; // Filters match, we want it from the url

				const filters = getFiltersFromString(targetQueryParam.val);
				const updatedFilterList = [];

				filters.forEach((urlFilter) => {
					if (urlFilter.toLowerCase() !== filterVal.toLowerCase()) {
						updatedFilterList.push(urlFilter);
					}
				});

				return updatedFilterList.join(',');
			}

			return targetQueryParam.val ? 
				`${targetQueryParam.val},${filterVal}` : 
				(filterVal || null);
		};

		const clearQueryPararms = () => $location.search({});

		const getFilterValue = (filter) => filter && Object.hasOwnProperty.call(filter, 'Tag') ? 
			filter.Tag : 
			(filter || null);
		
		const getQueryParamObject = (filterFamily, queryParams) => {
			const isFilterFamilyAnObject = filterFamily && typeof filterFamily === 'object';
			const filterKey = isFilterFamilyAnObject && Object.hasOwnProperty.call(filterFamily, 'filterId') ?
				filterFamily.filterId :
				isFilterFamilyAnObject && Object.hasOwnProperty.call(filterFamily, 'Name') ?
					filterFamily.Name :
					(filterFamily || null);

			return {
				key: filterKey,
				val: getValueFromObject(queryParams, filterKey)
			};
		};

		const getValueFromObject = (obj, key) => obj && typeof obj === 'object' ? 
			obj[key] || null : 
			null;

		const updateLocation = (filter, filterFamily) => {
			const filterVal = getFilterValue(filter);

			if (!filterVal) return;

			const queryParams = $location.search();
			const targetQueryParam = getQueryParamObject(filterFamily, queryParams);
			const updatedQueryParamVal = buildFilterQueryString(targetQueryParam, filterVal);

			$location.search(targetQueryParam.key, updatedQueryParamVal);
		};

		const cycleDisplay = () => {
			const resultsDisplayElement = document.getElementById('results-display');
            $animate.addClass(resultsDisplayElement, 'fade-out');

            if (vm.allCardData && vm.allCardData.length) {
                vm.items = vm.allCardData.filter(filterDataItems);
            }

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
		const loadCardsAndFilters = (cardData, callback) => {
			if (!cardData.length) { return; }

			const taggedCardData = Object.prototype.hasOwnProperty.call(cardData[0], 'Tags') ? 
				cardData : 
				filterService.transformAttributesToTags(cardData);

			vm.filters = filterService.build(taggedCardData);
			vm.allCardData = taggedCardData;
			vm.items = taggedCardData;
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: vm.items });
			$scope.$apply();
			
			if (callback && typeof callback === 'function') {
				callback();
			}
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

		const resetMap = () => {
			setTimeout(() => {
				const filteredItems = { 
					items: $scope.filteredItems 
				};
				angular.element('#results-display').trigger('bcpl.filter.changed', filteredItems);
			}, 250);
		};

		const setFiltersBasedOnQueryParams = () => {
			const queryParams = $location.search();

			if (Object.keys(queryParams).length) {
				Object.keys(queryParams).forEach((key) => {
					const filterStr = queryParams[key];
					const filters = getFiltersFromString(filterStr);
					const filterFamily = getFilterFamily(key);
					
					vm.activeFilters = [];

					filters.forEach((filter) => {
						setActiveFilters(filter, filterFamily);
					});
				});

				resetMap();
			}
			else {
				vm.clearFilters();
			}
		};

		const init = () => {
			cardService
				.get((data) => {
					loadCardsAndFilters(data, setFiltersBasedOnQueryParams);
				});
		};

		/* test-code */
		vm.getFilterFamily = getFilterFamily;
		vm.getFiltersFromString = getFiltersFromString;
		vm.getFilterValue = getFilterValue;
		vm.filterDataItems = filterDataItems;
		vm.formatKeyName = formatKeyName;
		vm.setActiveFilters = setActiveFilters;
		vm.updateLocation = updateLocation;
		/* end-test-code */

		$scope.$on('$locationChangeSuccess', function () {
			setFiltersBasedOnQueryParams();
			cycleDisplay();
		});

		init();
	};

	FilterPageCtrl.$inject = ['$location', '$scope', 'cardService', 'filterService', '$animate', '$timeout', 'CONSTANTS'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
