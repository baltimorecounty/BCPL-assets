((app, googleAnalytics) => {
	'use strict';

	const tagDirective = (CONSTANTS) => {
		const tagLink = function filterLink($scope) {
			$scope.toggleFilter = (activeFilter) => {
				const { trackEvent } = googleAnalytics;
				const filterSelected = !$scope.activeFilters.includes(activeFilter.Tag);
				const activeTags = $scope.tagData.Tags.filter((tagInfo) => {
					return tagInfo.Tag === activeFilter.Tag;
				});

				if (activeTags.length) {
					// One tag will only have one family, so unwrap it.
					$scope.filterHandler(activeFilter, activeTags[0]);
				}

				trackEvent({
					action: 'Filter Tag Selection',
					category: CONSTANTS.analytics.bcplLocationsCategory,
					label: `${$scope.tagData.name} ${activeFilter.Tag} = ${filterSelected ? 'Selected' : 'Unselected'}`
				});
			};
		};

		const directive = {
			scope: {
				filterHandler: '=',
				tagData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			templateUrl: CONSTANTS.templates.tag,
			link: tagLink
		};

		return directive;
	};

	tagDirective.$inject = ['CONSTANTS'];

	app.directive('tag', tagDirective);
})(angular.module('filterPageApp'), bcpl.utility.googleAnalytics);
