((app) => {
	'use strict';

	const filtersDirective = () => {
		const filterLink = function filterLink($scope) {
			$scope.$watch('filterData', () => {
				$scope.filterFamilies = $scope.filterData;
			});
		};

		const directive = {
			scope: {
				filterHandler: '=',
				filterData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/filters.html',
			link: filterLink
		};

		return directive;
	};

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
