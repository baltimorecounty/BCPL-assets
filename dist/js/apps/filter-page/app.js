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

		self.activeFilters = [];
		self.allData = {};

		self.setFilter = function (filter) {
			setActiveFilters(filter);
			self.items = self.allData.filter(filterDataItems);
		};

		dataLoaderService.load(bcpl.pageSpecific.databaseFilter, function (filters, data) {
			self.filters = filters;
			self.allData = data;
			self.items = data;
			$scope.$apply();
		});

		/* Private */

		var filterDataItems = function filterDataItems(dataItem) {
			var matchCount = 0;

			angular.element.each(self.activeFilters, function (index, activeFilter) {
				if (dataItem.attributes.indexOf(activeFilter) !== -1) {
					matchCount += 1;
				}
			});

			return matchCount === self.activeFilters.length;
		};

		var setActiveFilters = function setActiveFilters(filter) {
			var filterIndex = self.activeFilters.indexOf(filter);

			if (filterIndex === -1) {
				self.activeFilters.push(filter);
			} else {
				self.activeFilters.splice(filterIndex, 1);
			}
		};
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

	var filterLink = function filterLink($scope, element) {
		$scope.toggleFilter = function (activeFilter) {
			var $element = angular.element(element);

			$element.find('label').toggleClass('active', $element.has(':checked'));
			$scope.filterHandler(activeFilter);
		};
	};

	var filterDirective = function filterDirective() {
		var directive = {
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