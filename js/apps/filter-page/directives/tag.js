((app) => {
	'use strict';

	const tagDirective = (tagParsingService) => {
		const tagLink = function filterLink($scope) {
			$scope.toggleFilter = (activeFilter, $event) => {
				const $element = angular.element($event.currentTarget);

				$element.toggleClass('active');
				$scope.filterHandler(tagParsingService.extractTagName(activeFilter));
			};

			$scope.extractTagName = tagParsingService.extractTagName;
		};

		const directive = {
			scope: {
				filterHandler: '=',
				tagData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			template: '<li ng-repeat="tag in tagData"><button ng-click="toggleFilter(tag, $event)" ng-class="{active: activeFilters.indexOf(extractTagName(tag)) !== -1}">{{extractTagName(tag)}}</button></li>',
			link: tagLink
		};

		return directive;
	};

	tagDirective.$inject = ['tagParsingService'];

	app.directive('tag', tagDirective);
})(angular.module('filterPageApp'));
