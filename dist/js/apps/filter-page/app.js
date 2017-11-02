'use strict';

(function () {
	'use strict';

	angular.module('filterPageApp', ['ngAnimate']);
})();
'use strict';

(function (app) {
	var databasesService = function databasesService() {
		var template = '' + '<div class="card">' + '	<div class="row">' + '		<div class="col-sm-12 branch-address">' + '			<h2>' + '				<a href="#">{{cardData.name}}</a>' + '			</h2>' + '			<p>{{cardData.description}}</p>' + '			<div class="tags">' + '				<ul class="tag-list">' + '					<tag tag-data="cardData" active-filters="activeFilters" filter-handler="filterHandler"></tag>' + '				</ul>' + '			</div>' + '		</div>' + '	</div>' + '</div>';

		var dataTableIndexes = {
			name: 0,
			url: 1,
			description: 2,
			inPerson: 3,
			requiresCard: 4,
			attributes: 5
		};

		var arrayifyAttributes = function arrayifyAttributes($tags) {
			var tagArray = [];

			$tags.each(function (index, tagElement) {
				tagArray.push($(tagElement).text());
			});

			return tagArray;
		};

		var dataLoaderSuccess = function dataLoaderSuccess(data, externalSuccessCallback) {
			var $dataTable = $(data).find('#data-table');
			var $rows = $dataTable.find('tbody tr');
			var databaseData = [];

			$rows.each(function (index, rowElement) {
				var $row = $(rowElement);

				databaseData.push({
					name: $row.find('td').eq(dataTableIndexes.name).text(),
					url: $row.find('td').eq(dataTableIndexes.url).text(),
					description: $row.find('td').eq(dataTableIndexes.description).text(),
					inPerson: $row.find('td').eq(dataTableIndexes.inPerson).text(),
					requiresCard: $row.find('td').eq(dataTableIndexes.requiresCard).text(),
					attributes: arrayifyAttributes($row.find('td').eq(dataTableIndexes.attributes).find('.SETags'))
				});
			});

			externalSuccessCallback(databaseData);
		};

		var get = function get(successCallback, errorCallback) {
			$.ajax('/mockups/data/bcpl-databases.html').done(function (data) {
				dataLoaderSuccess(data, successCallback);
			}).fail(errorCallback);
		};

		return {
			template: template,
			get: get
		};
	};

	app.factory('databasesService', databasesService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var locationsService = function locationsService() {
		var template = '' + '<div class="card">' + '	<div class="row">' + '		<div class="col-sm-3 branch-name">' + '			<div class="branch-photo" style="background: url(/dist/images/branches/{{cardData.photo}})">' + '				<a href="#">{{cardData.name}}' + '					<i class="fa fa-caret-right" aria-hidden="true"></i>' + '				</a>' + '			</div>' + '		</div>' + '		<div class="col-sm-4 branch-address">' + '			<h2>{{cardData.name}} Branch</h2>' + '			<address>' + '				{{cardData.address}}' + '				<br/> {{cardData.city}}, MD {{cardData.zip}}' + '			</address>' + '		</div>' + '		<div class="col-sm-5 branch-email-phone">' + '			<div class="branch-email-phone-wrapper">' + '				<a href="mailto:{{cardData.email}}" class="branch-email">' + '					<i class="fa fa-envelope" aria-hidden="true"></i> Contact {{cardData.name}}' + '				</a>' + '				<a href="tel:{{cardData.phone}}" class="branch-phone">' + '					<i class="fa fa-phone" aria-hidden="true"></i> {{cardData.phone}}' + '				</a>' + '			</div>		' + '		</div>' + '	</div>' + '	<div class="row">' + '		<div class="col-xs-12">' + '			<div class="tags">' + '				<ul class="tag-list">' + '					<tag tag-data="cardData" active-filters="activeFilters" filter-handler="filterHandler"></tag>' + '				</ul>' + '			</div>' + '		</div>' + '	</div>' + '</div>';

		var get = function get(externalSuccessCallback, externalErrorCallback) {
			$.ajax('/mockups/data/branch-amenities.json').done(externalSuccessCallback).fail(externalErrorCallback);
		};

		return {
			template: template,
			get: get
		};
	};

	app.factory('locationsService', locationsService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var cardService = function cardService($location, $window, $injector) {
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

		var getFileNameWithoutExtension = function getFileNameWithoutExtension(path) {
			var pathParts = path.split('/');
			var lastPathPart = pathParts[pathParts.length - 1];
			var noExtension = lastPathPart.split('.')[0];
			return noExtension;
		};

		var get = function get(afterDataLoadedCallback) {
			var filenameWithoutExtension = getFileNameWithoutExtension($window.location.pathname);
			var dataService = $injector.get(filenameWithoutExtension + 'Service');

			dataService.get(function (data) {
				var filters = generateFiltersList(data);
				afterDataLoadedCallback(filters, data);
			});
		};

		return {
			get: get
		};
	};

	cardService.$inject = ['$location', '$window', '$injector'];

	app.factory('cardService', cardService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var tagParsingService = function tagParsingService() {
		var tagPartIndexes = {
			name: 0,
			tag: 1,
			type: 2
		};

		var extractTagName = function extractTagName(tag) {
			if (typeof tag === 'string') {
				var tagParts = tag.trim().split('|');
				return tagParts.length > 1 ? tagParts[1] : tagParts[0];
			}

			return '';
		};

		var findFamily = function findFamily(tagFamilies, familyName) {
			var matchedFamilies = tagFamilies.filter(function (tagFamily) {
				return tagFamily.name === familyName;
			});

			return matchedFamilies.length === 1 ? matchedFamilies[0] : undefined;
		};

		var createFamily = function createFamily(familyName, tag, type) {
			var newFamily = {
				name: familyName,
				type: type,
				tags: [tag]
			};

			return newFamily;
		};

		var parseTags = function parseTags(tagList) {
			if (!Array.isArray(tagList)) return [];

			var tagFamilies = [];

			tagList.forEach(function (tag) {
				var tagParts = tag.split('|').map(function (tagPart) {
					return tagPart.trim();
				});

				if (tagParts.length === 1) {
					tagParts.unshift('none'); // Add the tag family
				}

				if (tagParts.length === 2) {
					tagParts.push('many'); // Add the tag type
				}

				var foundFamily = findFamily(tagFamilies, tagParts[tagPartIndexes.name]);

				if (foundFamily) {
					foundFamily.tags.push(tagParts[tagPartIndexes.tag]);
					foundFamily.type = tagParts[tagPartIndexes.type];
				} else {
					var newFamily = createFamily(tagParts[tagPartIndexes.name], tagParts[tagPartIndexes.tag], tagParts[tagPartIndexes.type]);

					tagFamilies.push(newFamily);
				}
			});

			return tagFamilies;
		};

		return {
			parseTags: parseTags,
			extractTagName: extractTagName
		};
	};

	app.factory('tagParsingService', tagParsingService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var FilterPageCtrl = function FilterPageCtrl($scope, cardService, tagParsingService, $animate, $timeout) {
		var self = this;

		self.activeFilters = [];
		self.allCardData = {};

		/**
   * Makes sure the filters and tags are in sync.
   *
   * @param {string} filter
   */
		self.setFilter = function (filter, filterFamily) {
			var $resultsDisplay = angular.element('#results-display');

			setActiveFilters(filter, filterFamily);
			$animate.addClass($resultsDisplay, 'fade-out');
			self.items = self.allCardData.filter(filterDataItems);
			$resultsDisplay.trigger('bcpl.filter.changed', { items: self.items });
			bcpl.utility.windowShade.cycle(250, 2000);
			$timeout(function () {
				$animate.removeClass($resultsDisplay, 'fade-out');
			}, 250);
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

			angular.element('#results-display').trigger('bcpl.filter.changed', { items: self.items });
		};

		var transformAttributesToTags = function transformAttributesToTags(cardDataItem) {
			var attributes = cardDataItem.attributes;
			var tags = [];

			attributes.forEach(function (attribute) {
				tags.push(tagParsingService.extractTagName(attribute));
			});

			return tags;
		};

		/**
   * Allows for multiple-filter matches by verifying an active branch has
   * "all" active filters, and not just "any" active filters.
   *
   * @param {*} dataItem
   */
		var filterDataItems = function filterDataItems(cardDataItem) {
			var matchCount = 0;

			if (!cardDataItem) return false;

			var tags = transformAttributesToTags(cardDataItem);

			angular.forEach(self.activeFilters, function (activeFilter) {
				if (tags.indexOf(activeFilter) !== -1) {
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
		var setActiveFilters = function setActiveFilters(filter, filterFamily) {
			var filterIndex = self.activeFilters.indexOf(filter);
			var shouldAddFilter = filterIndex === -1;
			var isPickOne = filterFamily.type.trim().toLowerCase() === 'one';
			var tagsToRemove = [];

			if (shouldAddFilter && isPickOne) {
				angular.forEach(filterFamily.tags, function (tag) {
					if (tag !== filter) {
						tagsToRemove.push(tag);
					}
				});
			}

			angular.forEach(tagsToRemove, function (tagToRemove) {
				self.activeFilters.splice(self.activeFilters.indexOf(tagToRemove), 1);
			});

			if (shouldAddFilter) {
				self.activeFilters.push(filter);
			} else {
				self.activeFilters.splice(filterIndex, 1);
			}
		};

		/* init */

		cardService.get(loadCardsAndFilters);

	};

	FilterPageCtrl.$inject = ['$scope', 'cardService', 'tagParsingService', '$animate', '$timeout'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var cardDirective = function cardDirective($compile, $injector) {
		var cardLink = function cardLink($scope, element, attrs) {
			element.append($compile($injector.get(attrs.template + 'Service').template)($scope));
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

	cardDirective.$inject = ['$compile', '$injector'];

	app.directive('card', cardDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filterDirective = function filterDirective() {
		var filterLink = function filterLink($scope, filterElement) {
			var $filterElement = angular.element(filterElement);
			var $input = $filterElement.find('input');
			var inputType = $scope.filterFamily.type.trim().toLowerCase() === 'many' ? 'checkbox' : 'radio';
			$input.prop('type', inputType);

			if (inputType === 'radio') {
				$input.prop('name', $scope.filterFamily.name);
			}

			$scope.toggleFilter = function (activeFilter) {
				$scope.isFilterChecked = $filterElement.has(':checked').length > 0;
				$scope.filterHandler(activeFilter, $scope.filterFamily);
			};
		};

		var directive = {
			scope: {
				tag: '=',
				activeFilters: '=',
				filterHandler: '=',
				filterFamily: '='
			},
			restrict: 'E',
			templateUrl: '/dist/js/apps/filter-page/templates/filter.html',
			link: filterLink
		};

		return directive;
	};

	filterDirective.$inject = [];

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective(tagParsingService) {
		var filterLink = function filterLink($scope) {
			$scope.filterFamilies = tagParsingService.parseTags($scope.filterData);
		};

		var directive = {
			scope: {
				filterHandler: '=',
				filterData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			templateUrl: '/dist/js/apps/filter-page/templates/filters.html',
			link: filterLink
		};

		return directive;
	};

	filtersDirective.$inject = ['tagParsingService'];

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var tagDirective = function tagDirective(tagParsingService) {
		var tagLink = function filterLink($scope) {
			$scope.toggleFilter = function (activeFilter) {
				var tagFamiliesForCard = tagParsingService.parseTags($scope.tagData.attributes);
				var activeTagName = tagParsingService.extractTagName(activeFilter);
				var activeTagFamily = tagFamiliesForCard.filter(function (tagFamily) {
					return tagFamily.tags.indexOf(activeTagName) !== -1;
				})[0];

				$scope.filterHandler(activeTagName, activeTagFamily);
			};

			$scope.extractTagName = tagParsingService.extractTagName;
		};

		var directive = {
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