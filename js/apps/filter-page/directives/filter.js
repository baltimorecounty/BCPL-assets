(() => {
	'use strict';

	const filterDirective = () => {
		const template = '' +
			'<label ng-class="{active: activeFilters.indexOf(filterName) !== -1}">' +
			'<input type="checkbox" ng-click="toggleFilter(filterName)" ng-checked="activeFilters.indexOf(filterName) !== -1" /> {{filterName}}</label>';

		const filterLink = function filterLink($scope, element) {
			$scope.toggleFilter = (activeFilter) => {
				const $element = angular.element(element);

				$element.find('label').toggleClass('active', $element.has(':checked'));
				$scope.filterHandler(activeFilter);
			};
		};

		const directive = {
			scope: {
				filterHandler: '=',
				filterName: '=',
				activeFilters: '='
			},
			restrict: 'E',
			template: template,
			link: filterLink
		};

		return directive;
	};

	filterDirective.$inject = [];

	angular
		.module('filterPageApp')
		.directive('filter', filterDirective);
})();
