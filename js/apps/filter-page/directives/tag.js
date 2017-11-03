((app) => {
	'use strict';

	const tagDirective = (tagParsingService) => {
		const tagLink = function filterLink($scope) {
			$scope.toggleFilter = (activeFilter) => {
				const tagFamiliesForCard = tagParsingService.parseTags($scope.tagData.attributes);
				const activeTagName = tagParsingService.extractTagName(activeFilter);
				const activeTagFamilies = tagFamiliesForCard.filter((tagFamily) => {
					return tagFamily.tags.indexOf(activeTagName) !== -1;
				});

				if (activeTagFamilies.length) {
					// One tag will only have one family, so unwrap it.
					$scope.filterHandler(activeTagName, activeTagFamilies[0]);
				}
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
			template: '<li ng-repeat="tag in tagData.attributes"><button ng-click="toggleFilter(tag, $event)" ng-class="{active: activeFilters.indexOf(extractTagName(tag)) !== -1}">{{extractTagName(tag)}}</button></li>',
			link: tagLink
		};

		return directive;
	};

	tagDirective.$inject = ['tagParsingService'];

	app.directive('tag', tagDirective);
})(angular.module('filterPageApp'));
