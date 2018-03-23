((app) => {
	'use strict';

	const filtersDirective = () => {
		const filterLink = function filterLink($scope) {
			const findFilterMatch = (tagName, filter) => tagName.toLowerCase() === filter.toLowerCase();

			$scope.$watch('filterData', () => {
				$scope.filterFamilies = $scope.filterData ? $scope.filterData.map(addFilterId) : $scope.filterFamilies;

				if ($scope.filterFamilies && $scope.filterFamilies.length) {
					$scope.filterFamilies.forEach((filterFamily) => {
						if (!filterFamily) return;

						const filterFamilyHasTags = Object.hasOwnProperty.call(filterFamily, 'tags') && filterFamily.tags.length;
						const tags = filterFamilyHasTags ?
							filterFamily.tags :
							[];
						let hasMatch = false;

						$scope.activeFilters.forEach((filter) => {
							if (!hasMatch) {
								hasMatch = !!tags
									.filter((tagName) => findFilterMatch(tagName, filter)).length;
							}
						});

						// This should probably be refactored to be immutable
						filterFamily.isFilterActive = hasMatch; // eslint-disable-line no-param-reassign
					});
				}
			});

			const addFilterId = (filterFamily) => {
				const newFamily = filterFamily;

				if (newFamily) {
					newFamily.name = newFamily.name === 'none' ? $scope.familyNameOverride : newFamily.name;
					newFamily.filterId = newFamily.name.replace(/[^\w]/g, '-');
				}

				return newFamily;
			};
		};

		const directive = {
			scope: {
				familyNameOverride: '@',
				isInitiallyExpanded: '@',
				filterHandler: '=',
				filterData: '=',
				activeFilters: '=',
				clearFilterFn: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/filters.html',
			link: filterLink
		};

		return directive;
	};

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
