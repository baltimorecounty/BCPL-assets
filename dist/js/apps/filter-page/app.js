'use strict';

(function () {
	'use strict';

	angular.module('filterPageApp', ['ngAnimate']);
})();
'use strict';

(function (app) {
	'use strict';

	var constants = {
		templates: {
			databases: '/dist/js/apps/filter-page/templates/card-databases.html',
			locations: '/dist/js/apps/filter-page/templates/card-locations.html'
		},
		urls: {
			databases: '/_structured-content/BCPL_Databases',
			locations: '/mockups/data/branch-amenities.json'
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var cardVisibilityFilter = function cardVisibilityFilter(tagParsingService) {
		return function (cards, activeFilters) {
			var filtered = [];

			angular.forEach(cards, function (card) {
				var matches = 0;

				angular.forEach(card.attributes, function (attribute) {
					if (activeFilters.indexOf(tagParsingService.extractTagName(attribute)) !== -1) {
						matches += 1;
					}
				});

				if (matches === activeFilters.length) {
					filtered.push(card);
				}
			});

			return filtered;
		};
	};

	cardVisibilityFilter.$inject = ['tagParsingService'];

	app.filter('cardVisibilityFilter', cardVisibilityFilter);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var databasesService = function databasesService(CONSTANTS) {
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
				var tagText = $(tagElement).text().trim();
				if (tagText.length) {
					tagArray.push(tagText);
				}
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
			$.ajax(CONSTANTS.urls.databases).done(function (data) {
				dataLoaderSuccess(data, successCallback);
			}).fail(errorCallback);
		};

		return {
			get: get
		};
	};

	databasesService.$inject = ['CONSTANTS'];

	app.factory('databasesService', databasesService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var locationsService = function locationsService(CONSTANTS) {
		var get = function get(externalSuccessCallback, externalErrorCallback) {
			$.ajax(CONSTANTS.urls.locations).done(function (data) {
				internalSuccessCallback(data, externalSuccessCallback);
			}).fail(externalErrorCallback);
		};

		var internalSuccessCallback = function internalSuccessCallback(data, externalSuccessCallback) {
			var parsedData = typeof data === 'string' ? JSON.parse(data) : data;

			externalSuccessCallback(parsedData);
		};

		return {
			get: get
		};
	};

	locationsService.$inject = ['CONSTANTS'];

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
			var cleanedFilters = sortedUniqueFilters.filter(function (uniqueFilter) {
				return uniqueFilter.trim().length > 0;
			});

			return cleanedFilters;
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

	var FilterPageCtrl = function FilterPageCtrl($scope, cardService, tagParser, $animate, $timeout) {
		var self = this;

		self.activeFilters = [];
		self.allCardData = {};
		self.isEverythingFilteredOut = false;

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
			$scope.$apply();
		};

		var transformAttributesToTags = function transformAttributesToTags(cardDataItem) {
			var attributes = cardDataItem.attributes;
			var tags = [];

			attributes.forEach(function (attribute) {
				var tagName = tagParser.extractTagName(attribute);
				if (tagName.length > 0) {
					tags.push(tagName);
				}
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
				var isFound = self.activeFilters.indexOf(tagToRemove) !== -1;

				if (isFound) {
					self.activeFilters.splice(self.activeFilters.indexOf(tagToRemove), 1);
				}
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

	var cardDirective = function cardDirective($compile, $injector, $templateRequest, CONSTANTS) {
		var cardLink = function cardLink($scope, element, attrs) {
			$templateRequest(CONSTANTS.templates[attrs.template]).then(function (html) {
				element.append($compile(html)($scope));
			});
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

	cardDirective.$inject = ['$compile', '$injector', '$templateRequest', 'CONSTANTS'];

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
			$scope.$watch('filterData', function () {
				$scope.filterFamilies = tagParsingService.parseTags($scope.filterData);
			});
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
				var activeTagFamilies = tagFamiliesForCard.filter(function (tagFamily) {
					return tagFamily.tags.indexOf(activeTagName) !== -1;
				});

				if (activeTagFamilies.length) {
					// One tag will only have one family, so unwrap it.
					$scope.filterHandler(activeTagName, activeTagFamilies[0]);
				}
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
			templateUrl: '/dist/js/apps/filter-page/templates/tag.html',
			link: tagLink
		};

		return directive;
	};

	tagDirective.$inject = ['tagParsingService'];

	app.directive('tag', tagDirective);
})(angular.module('filterPageApp'));