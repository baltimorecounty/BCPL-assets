((app) => {
	'use strict';

	const filtersDirective = () => {
		const filterLink = function filterLink($scope) {
			$scope.$watch('filterData', () => {
				$scope.filterFamilies = $scope.filterData; // tagParsingService.parseTags($scope.filterData);
			});
		};

		const directive = {
			scope: {
				filterHandler: '=',
				filterData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			templateUrl: '/dist/js/apps/filter-page/templates/filters.html',
			link: filterLink
		};

		return directive;
	};

	filtersDirective.$inject = [];

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
