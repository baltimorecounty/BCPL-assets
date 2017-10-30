'use strict';

(function () {
	'use strict';

	angular.module('filterPageApp', []);
})();
'use strict';

(function () {
	'use strict';

	var cardService = function cardService() {
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

		var get = function get(dataLoaderNameSpace, afterDataLoadedCallback) {
			dataLoaderNameSpace.dataLoader(function (data) {
				var filters = generateFiltersList(data);
				afterDataLoadedCallback(filters, data);
			});
		};

		return {
			get: get
		};
	};

	cardService.$inject = [];

	angular.module('filterPageApp').factory('cardService', cardService);
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

	var FilterPageCtrl = function FilterPageCtrl($scope, cardService) {
		var self = this;

		self.activeFilters = [];
		self.allCardData = {};

		/**
   * Makes sure the filters and tags are in sync.
   *
   * @param {string} filter
   */
		self.setFilter = function (filter) {
			setActiveFilters(filter);
			self.items = self.allCardData.filter(filterDataItems);
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};

		/* Private */

		/**
   * Loads up the list of filters and all of the branch data.
   *
   * @param {[string]} filters
   * @param {[*]} branchData
   */
		var loadCardsAndFilters = function loadCardsAndFilters(filters, cardData) {
			self.filters = filters;
			self.allCardData = cardData;
			self.items = cardData;
			$scope.$apply();

			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};

		/**
   * Allows for multiple-filter matches by verifying an active branch has
   * "all" active filters, and not just "any" active filters.
   *
   * @param {*} dataItem
   */
		var filterDataItems = function filterDataItems(dataItem) {
			var matchCount = 0;

			if (!dataItem) return false;

			angular.element.each(self.activeFilters, function (index, activeFilter) {
				if (dataItem.attributes.indexOf(activeFilter) !== -1) {
					matchCount += 1;
				}
			});

			return matchCount === self.activeFilters.length;
		};

		/**
   * Toggles filters in the master filter list since there are multiple
   * ways of setting a filter (tags or filter list).
   *
   * @param {*} filter
   */
		var setActiveFilters = function setActiveFilters(filter) {
			var filterIndex = self.activeFilters.indexOf(filter);

			if (filterIndex === -1) {
				self.activeFilters.push(filter);
			} else {
				self.activeFilters.splice(filterIndex, 1);
			}
		};

		/* init */

		cardService.get(bcpl.pageSpecific.branchesFilter, loadCardsAndFilters);

	};

	FilterPageCtrl.$inject = ['$scope', 'cardService'];

	angular.module('filterPageApp').controller('FilterPageCtrl', FilterPageCtrl);
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