(() => {
	'use strict';


	const filterLink = function filterLink($scope, element) {
		$scope.toggleFilter = (activeFilter) => {
			const $element = angular.element(element);

			$element.find('label').toggleClass('active', $element.has(':checked'));
			$scope.filterHandler(activeFilter);
		};
	};

	const filterDirective = () => {
		const directive = {
			scope: {
				filterHandler: '=',
				filterName: '='
			},
			restrict: 'E',
			template: '<label><input type="checkbox" ng-click="toggleFilter(filterName)" /> {{filterName}}</label>',
			link: filterLink
		};

		return directive;
	};

	filterDirective.$inject = [];

	angular
		.module('filterPageApp')
		.directive('filter', filterDirective);
})();
