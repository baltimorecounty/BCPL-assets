((app) => {
	const loadMoreDirective = (CONSTANTS) => {
		const directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.loadMoreTemplate,
			scope: {
				loadNextPage: '=',
				chunkSize: '='
			}
		};

		return directive;
	};

	loadMoreDirective.$inject = ['CONSTANTS'];

	app.directive('loadMore', loadMoreDirective);
})(angular.module('eventsPageApp'));
