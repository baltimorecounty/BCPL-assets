'use strict';

(function () {
	'use strict';

	angular.module('filterPageApp', []);
})();
'use strict';

(function () {
	'use strict';

	var dataLoaderService = function dataLoaderService() {
		var generateFiltersList = function generateFiltersList(data) {
			var filters = [];

			angular.forEach(data, function (element) {
				filters = filters.concat(element.attributes);
			});

			var uniqueFilters = _.uniq(filters);
			var sortedUniqueFilters = _.sortBy(uniqueFilters, function (uniqueFilter) {
				return uniqueFilter;
			});

			return sortedUniqueFilters;
		};

		var load = function load(dataLoaderNameSpace, afterDataLoadedCallback) {
			dataLoaderNameSpace.dataLoader(function (data) {
				var filters = generateFiltersList(data);
				afterDataLoadedCallback(filters, data);
			});
		};

		return {
			load: load
		};
	};

	dataLoaderService.$inject = [];

	angular.module('filterPageApp').factory('dataLoaderService', dataLoaderService);
})();
'use strict';

(function () {
	'use strict';

	var filterPageCtrl = function filterPageCtrl($scope, dataLoaderService) {
		var self = this;

		dataLoaderService.load(bcpl.pageSpecific.databaseFilter, function (filters, data) {
			self.filters = filters;
			self.items = data;
			$scope.$apply();
		});
	};

	filterPageCtrl.$inject = ['$scope', 'dataLoaderService'];

	angular.module('filterPageApp').controller('filterPageCtrl', filterPageCtrl);
})();
'use strict';

(function () {
	'use strict';

	var template = '' + '<div class="card">' + '	<div class="row">' + '		<div class="col-sm-12 branch-address">' + '			<h4>' + '				<a href="#">{{card.name}}</a>' + '			</h4>' + '			<p>{{card.description}}</p>' + '			<div class="tags">Categories:' + '				<ul class="tag-list">' + '					<li ng-repeat="attribute in card.attributes"><button>{{attribute}}</button></li>' + '				</ul>' + '			</div>' + '		</div>' + '	</div>' + '</div>';

	var cardDirective = function cardDirective() {
		var directive = {
			restrict: 'E',
			template: template
		};

		return directive;
	};

	cardDirective.$inject = [];

	angular.module('filterPageApp').directive('card', cardDirective);
})();
'use strict';

(function () {
	'use strict';

	var filterDirective = function filterDirective() {
		var directive = {
			restrict: 'E',
			template: '<label><input type="checkbox" /> {{filter}}</label>'
		};

		return directive;
	};

	filterDirective.$inject = [];

	angular.module('filterPageApp').directive('filter', filterDirective);
})();
'use strict';

(function () {
	'use strict';

	var tagDirective = function tagDirective() {
		var directive = {
			restrict: 'E',
			template: '<button>{{tag}}</label>'
		};

		return directive;
	};

	tagDirective.$inject = [];

	angular.module('filterPageApp').directive('tag', tagDirective);
})();