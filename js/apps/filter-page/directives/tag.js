((app) => {
	'use strict';

	const tagDirective = (constants) => {
		const tagLink = function filterLink($scope) {
			$scope.toggleFilter = (activeFilter) => {
				const activeTags = $scope.tagData.Tags.filter((tagInfo) => {
					return tagInfo.Tag === activeFilter.Tag;
				});

				if (activeTags.length) {
					// One tag will only have one family, so unwrap it.
					$scope.filterHandler(activeFilter, activeTags[0]);
				}
			};
		};

		const directive = {
			scope: {
				filterHandler: '=',
				tagData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			templateUrl: constants.templates.tag,
			link: tagLink
		};

		return directive;
	};

	tagDirective.$inject = ['CONSTANTS'];

	app.directive('tag', tagDirective);
})(angular.module('filterPageApp'));
