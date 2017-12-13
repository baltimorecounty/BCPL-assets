((app) => {
	'use strict';

	const filtersDirective = () => {
		const filterLink = function filterLink($scope) {
			$scope.$watch('filterData', () => {
				$scope.filterFamilies = $scope.filterData ? $scope.filterData.map(addFilterId) : $scope.filterFamilies;
			});

			const addFilterId = (filterFamily) => {
				const newFamily = filterFamily;

				newFamily.name = newFamily.name === 'none' ? $scope.familyNameOverride : newFamily.name;

				if (newFamily) {
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
