((app) => {
	'use strict';

	const filtersDirective = (tagParsingService) => {
		const filterLink = function filterLink($scope) {
			$scope.$watch('filterData', () => {
				$scope.filterFamilies = tagParsingService.parseTags($scope.filterData);
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

	filtersDirective.$inject = ['tagParsingService'];

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
