((app, googleAnalytics) => {
	'use strict';

	const filterDirective = (CONSTANTS) => {
		const filterLink = function filterLink($scope, filterElement) {
			const { trackEvent } = googleAnalytics;
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

				trackEvent({
					action: 'Filter Selection',
					category: CONSTANTS.analytics.bcplLocationsCategory,
					label: `${activeFilter} = ${$scope.isFilterChecked ? 'Selected' : 'Unselected'}`
				});
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
			templateUrl: CONSTANTS.templates.filter,
			link: filterLink
		};

		return directive;
	};

	filterDirective.$inject = ['CONSTANTS'];

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'), bcpl.utility.googleAnalytics);
