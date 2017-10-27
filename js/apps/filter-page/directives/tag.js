(() => {
	'use strict';

	const tagLink = function filterLink($scope) {
		$scope.toggleFilter = (activeFilter, $event) => {
			const $element = angular.element($event.currentTarget);

			$element.toggleClass('active');
			$scope.filterHandler(activeFilter);
		};
	};

	const tagDirective = () => {
		const directive = {
			scope: {
				filterHandler: '=',
				tagData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			template: '<li ng-repeat="tag in tagData"><button ng-click="toggleFilter(tag, $event)" ng-class="{active: activeFilters.indexOf(tag) !== -1}">{{tag}}</button></li>',
			link: tagLink
		};

		return directive;
	};

	tagDirective.$inject = [];

	angular
		.module('filterPageApp')
		.directive('tag', tagDirective);
})();
