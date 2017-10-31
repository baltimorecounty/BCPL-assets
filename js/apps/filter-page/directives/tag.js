(() => {
	'use strict';

	const tagLink = function filterLink($scope) {
		$scope.toggleFilter = (activeFilter, $event) => {
			const $element = angular.element($event.currentTarget);

			$element.toggleClass('active');
			$scope.filterHandler(activeFilter);
		};

		$scope.extractTagName = (tag) => {
			const tagParts = tag.split('|');
			return tagParts.length > 0 ? tagParts[1] : tagParts[0];
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
			template: '<li ng-repeat="tag in tagData"><button ng-click="toggleFilter(tag, $event)" ng-class="{active: activeFilters.indexOf(tag) !== -1}">{{extractTagName(tag)}}</button></li>',
			link: tagLink
		};

		return directive;
	};

	tagDirective.$inject = [];

	angular
		.module('filterPageApp')
		.directive('tag', tagDirective);
})();
