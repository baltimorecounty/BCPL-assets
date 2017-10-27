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

	var templateService = function templateService() {
		var databasesTemplate = '' + '<div class="card">' + '	<div class="row">' + '		<div class="col-sm-12 branch-address">' + '			<h4>' + '				<a href="#">{{cardData.name}}</a>' + '			</h4>' + '			<p>{{cardData.description}}</p>' + '			<div class="tags">Categories:' + '				<ul class="tag-list">' + '					<tag tag-data="cardData.attributes" active-filters="activeFilters" filter-handler="filterHandler"></tag>' + '				</ul>' + '			</div>' + '		</div>' + '	</div>' + '</div>';

		var locationsTemplate = '' + '<div class="card">' + '	<div class="row">' + '		<div class="col-sm-3 branch-name">' + '			<div class="branch-photo" style="background: url(/dist/images/branches/{{cardData.photo}})">' + '				<a href="#">{{cardData.name}}' + '					<i class="fa fa-caret-right" aria-hidden="true"></i>' + '				</a>' + '			</div>' + '		</div>' + '		<div class="col-sm-4 branch-address">' + '			<h4>{{cardData.name}} Branch</h4>' + '			<address>' + '				{{cardData.address}}' + '				<br/> {{cardData.city}}, MD {{cardData.zip}}' + '			</address>' + '		</div>' + '		<div class="col-sm-5 branch-email-phone">' + '			<div class="branch-email-phone-wrapper">' + '				<a href="mailto:{{cardData.email}}" class="branch-email">' + '					<i class="fa fa-envelope" aria-hidden="true"></i> Contact {{cardData.name}}' + '				</a>' + '				<a href="tel:{{cardData.phone}}" class="branch-phone">' + '					<i class="fa fa-phone" aria-hidden="true"></i> {{cardData.phone}}' + '				</a>' + '			</div>		' + '		</div>' + '	</div>' + '	<div class="row">' + '		<div class="col-xs-12">' + '			<hr />' + '		</div>' + '	</div>' + '	<div class="row">' + '		<div class="col-xs-12">' + '			<div class="tags">' + '				<ul class="tag-list">' + '					<tag tag-data="cardData.attributes" active-filters="activeFilters" filter-handler="filterHandler"></tag>' + '				</ul>' + '			</div>' + '		</div>' + '	</div>' + '</div>';

		var get = function get(templateName) {
			switch (templateName) {
				case 'databases':
					return databasesTemplate;
				case 'locations':
					return locationsTemplate;
				default:
					return '';
			}
		};

		return {
			get: get
		};
	};

	templateService.$inject = [];

	angular.module('filterPageApp').factory('templateService', templateService);
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

		dataLoaderService.load(bcpl.pageSpecific.branchesFilter, function (filters, data) {
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

	var cardDirective = function cardDirective($compile, templateService) {
		var cardLink = function cardLink($scope, element, attrs) {
			element.append($compile(templateService.get(attrs.template))($scope));
		};

		var directive = {
			restrict: 'E',
			scope: {
				filterHandler: '=',
				cardData: '=',
				activeFilters: '=',
				template: '='
			},
			template: '',
			link: cardLink
		};

		return directive;
	};

	cardDirective.$inject = ['$compile', 'templateService'];

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
				filterName: '=',
				activeFilters: '='
			},
			restrict: 'E',
			template: '<label ng-class="{active: activeFilters.indexOf(filterName) !== -1}"><input type="checkbox" ng-click="toggleFilter(filterName)" ng-checked="activeFilters.indexOf(filterName) !== -1" /> {{filterName}}</label>',
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

	var tagLink = function filterLink($scope) {
		$scope.toggleFilter = function (activeFilter, $event) {
			var $element = angular.element($event.currentTarget);

			$element.toggleClass('active');
			$scope.filterHandler(activeFilter);
		};
	};

	var tagDirective = function tagDirective() {
		var directive = {
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

	angular.module('filterPageApp').directive('tag', tagDirective);
})();