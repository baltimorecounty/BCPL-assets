((app) => {
	'use strict';

	const filterDirective = () => {
		const filterLink = function filterLink($scope, element) {
			$scope.toggleFilter = (activeFilter) => {
				const $element = angular.element(element);
				$element.find('label').toggleClass('active', $element.has(':checked'));

				$scope.filterHandler(activeFilter);
			};
		};

		const directive = {
			scope: {
				tag: '=',
				activeFilters: '=',
				filterHandler: '='
			},
			restrict: 'E',
			templateUrl: '/dist/js/apps/filter-page/templates/filter.html',
			link: filterLink
		};

		return directive;
	};

	filterDirective.$inject = [];

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'));
