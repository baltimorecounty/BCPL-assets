((app) => {
	'use strict';

	const filterDirective = () => {
		const filterLink = function filterLink($scope, filterElement) {
			const $filterElement = angular.element(filterElement);
			const $input = $filterElement.find('input');
			const inputType = $scope.filterFamily.type.trim().toLowerCase() === 'many' ? 'checkbox' : 'radio';
			$input.prop('type', inputType);

			if (inputType === 'radio') {
				$input.prop('name', $scope.filterFamily.name);
			}
						
			$scope.toggleFilter = (activeFilter) => {
				$scope.isFilterChecked = $filterElement.has(':checked').length > 0;
				$scope.filterHandler(activeFilter, $scope.filterFamily);
			};
		};

		const directive = {
			scope: {
				tag: '=',
				activeFilters: '=',
				filterHandler: '=',
				filterFamily: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/filter.html',
			link: filterLink
		};

		return directive;
	};

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'));
