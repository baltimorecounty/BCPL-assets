"use strict";

(function () {
  "use strict";

  angular.module("filterPageApp", ["ngAnimate"]).config(function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
})();
'use strict';

(function (app) {
	'use strict';

	var constants = {
		templates: {
			databases: '/js/apps/filter-page/templates/card-databases.html',
			locations: '/js/apps/filter-page/templates/card-locations.html'
		},
		urls: {
			databases: 'http://oit226471:1919/api/structured-content/databases',
			// databases: 'https://testservices.bcpl.info/api/structured-content/databases',
			locations: '/sebin/q/r/branch-amenities.json'
		},
		filters: {
			tags: {
				types: {
					pickOne: 'one',
					pickMany: 'many'
				}
			}
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var cardVisibilityFilter = function cardVisibilityFilter() {
		return function (cards, activeFilters) {
			var filtered = [];

			angular.forEach(cards, function (card) {
				var matches = 0;

				angular.forEach(card.Tags, function (tag) {
					if (activeFilters.indexOf(tag.Tag) !== -1) {
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

	cardVisibilityFilter.$inject = [];

	app.filter('cardVisibilityFilter', cardVisibilityFilter);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	var databasesService = function databasesService(CONSTANTS) {
		var get = function get(successCallback, errorCallback) {
			$.ajax(CONSTANTS.urls.databases).done(successCallback).fail(errorCallback);
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
				var sortedData = _.sortBy(data, function (dataItem) {
					return dataItem.Title;
				});
				afterDataLoadedCallback(sortedData);
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
	var filterService = function filterService() {
		var getAllTagInfo = function getAllTagInfo(dataWithTags) {
			var tags = [];

			angular.forEach(dataWithTags, function (dataItem) {
				tags = tags.concat(dataItem.Tags);
			});

			return tags;
		};

		var getFamilies = function getFamilies(tagInfoArr) {
			return _.uniq(_.pluck(tagInfoArr, 'Name'), function (name) {
				return name;
			});
		};

		var getFamilyTags = function getFamilyTags(familyName, tagInfoArr) {
			var familyTagInfo = _.where(tagInfoArr, { Name: familyName });
			return _.uniq(_.sortBy(_.pluck(familyTagInfo, 'Tag'), function (tag) {
				return tag;
			}), function (tag) {
				return tag;
			});
		};

		var getFamilyType = function getFamilyType(familyName, tagInfoArr) {
			var familyType = _.findWhere(tagInfoArr, { Name: familyName });
			return familyType ? familyType.Type : 'none';
		};

		var build = function build(cardData) {
			var filterData = [];

			var tagInfoArr = getAllTagInfo(cardData);
			var families = getFamilies(tagInfoArr);

			angular.forEach(families, function (family) {
				filterData.push({
					name: family,
					tags: getFamilyTags(family, tagInfoArr),
					type: getFamilyType(family, tagInfoArr)
				});
			});

			return filterData;
		};

		var transformAttributesToTags = function transformAttributesToTags(cardData) {
			var taggedCardData = [];

			angular.forEach(cardData, function (cardDataItem) {
				var cardDataItemWithTags = angular.extend(cardDataItem, { Tags: [] });

				angular.forEach(cardDataItem.attributes, function (attribute) {
					var tag = {
						Name: 'none',
						Tag: attribute,
						Type: 'Many'
					};

					cardDataItemWithTags.Tags.push(tag);
				});

				taggedCardData.push(cardDataItemWithTags);
			});

			return taggedCardData;
		};

		return {
			build: build,
			transformAttributesToTags: transformAttributesToTags
		};
	};

	app.factory('filterService', filterService);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var FilterPageCtrl = function FilterPageCtrl($location, $scope, cardService, filterService, $animate, $timeout, CONSTANTS) {
		var vm = this;

		vm.activeFilters = [];
		vm.allCardData = {};
		vm.isEverythingFilteredOut = false;

		/**
   * Makes sure the filters and tags are in sync.
   *
   * @param {string} filter
   */
		vm.setFilter = function (filter, filterFamily) {
			setActiveFilters(filter, filterFamily);
			cycleDisplay();
		};

		var clearQueryPararms = function clearQueryPararms() {
			return $location.search({});
		};

		vm.clearFilters = function () {
			vm.activeFilters = [];
			clearQueryPararms();
			cycleDisplay();
		};

		/* Private */

		var cycleDisplay = function cycleDisplay() {
			var resultsDisplayElement = document.getElementById('results-display');
			$animate.addClass(resultsDisplayElement, 'fade-out');
			vm.items = vm.allCardData.filter(filterDataItems);
			angular.element(resultsDisplayElement).trigger('bcpl.filter.changed', { items: vm.items });
			bcpl.utility.windowShade.cycle(250, 2000);
			$timeout(function () {
				$animate.removeClass(resultsDisplayElement, 'fade-out');
			}, 250);
		};

		/**
   * Loads up the list of filters and all of the branch data.
   *
   * @param {[string]} filters
   * @param {[*]} branchData
   */
		var loadCardsAndFilters = function loadCardsAndFilters(cardData, callback) {
			if (!cardData.length) {
				return;
			}

			var taggedCardData = Object.prototype.hasOwnProperty.call(cardData[0], 'Tags') ? cardData : filterService.transformAttributesToTags(cardData);

			vm.filters = filterService.build(taggedCardData);
			vm.allCardData = taggedCardData;
			vm.items = taggedCardData;
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: vm.items });

			$scope.$apply();
			if (callback && typeof callback === 'function') {
				callback();
			}
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

			var tags = _.pluck(cardDataItem.Tags, 'Tag');

			angular.forEach(vm.activeFilters, function (activeFilter) {
				if (tags.indexOf(activeFilter) !== -1) {
					matchCount += 1;
				}
			});

			return matchCount === vm.activeFilters.length;
		};

		/**
   * Toggles filters in the master filter list since there are multiple
   * ways of setting a filter (tags or filter list).
   *
   * @param {*} filter
   */
		var setActiveFilters = function setActiveFilters(filter, filterFamily) {
			var isTagInfo = Object.prototype.hasOwnProperty.call(filter, 'Tag');
			var tagString = isTagInfo ? filter.Tag : filter;
			var filterIndex = vm.activeFilters.indexOf(tagString);
			var shouldAddFilter = filterIndex === -1;
			var foundFilterFamily = filterFamily;

			if (isTagInfo) {
				foundFilterFamily = _.where(vm.filters, { name: filter.Name });
				if (foundFilterFamily.length === 1) {
					foundFilterFamily = foundFilterFamily[0];
				}
			}

			var isPickOne = foundFilterFamily.type ? foundFilterFamily.type.toLowerCase() === CONSTANTS.filters.tags.types.pickOne : false;

			var tagsToRemove = [];

			if (shouldAddFilter && isPickOne) {
				angular.forEach(foundFilterFamily.tags, function (tag) {
					if (tag !== tagString) {
						tagsToRemove.push(tag);
					}
				});
			}

			angular.forEach(tagsToRemove, function (tagToRemove) {
				var isFound = vm.activeFilters.indexOf(tagToRemove) !== -1;

				if (isFound) {
					vm.activeFilters.splice(vm.activeFilters.indexOf(tagToRemove), 1);
				}
			});

			if (shouldAddFilter) {
				vm.activeFilters.push(tagString);
			} else {
				vm.activeFilters.splice(filterIndex, 1);
			}
		};

		var toggleIcon = function toggleIcon(collapseEvent) {
			var $collapsible = angular.element(collapseEvent.currentTarget);
			var $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		/* init */
		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		var formatKeyName = function formatKeyName(key) {
			return !key ? "" : key.replace(/-/g, " ");
		};

		var getFilterFamily = function getFilterFamily(key) {
			var formattedKeyName = formatKeyName(key);
			var filterFamliy = vm.filters.filter(function (filter) {
				return formattedKeyName.toLowerCase() === filter.name.toLowerCase();
			});

			return filterFamliy.length ? filterFamliy[0] : null;
		};

		var getFiltersFromString = function getFiltersFromString(filterStr) {
			if (!filterStr) return [];

			var containsMultipleFilters = filterStr && filterStr.indexOf(',') > -1;

			return containsMultipleFilters ? filterStr.split(',') : [filterStr];
		};

		var setFiltersBasedOnQueryParams = function setFiltersBasedOnQueryParams() {
			var queryParams = $location.search();

			if (queryParams) {
				Object.keys(queryParams).forEach(function (key) {
					var filterStr = queryParams[key];
					var filters = getFiltersFromString(filterStr);
					var filterFamily = getFilterFamily(key);

					filters.forEach(function (filter) {
						setActiveFilters(filter, filterFamily);
					});
				});

				resetMap();
			}
		};

		var resetMap = function resetMap() {
			setTimeout(function () {
				var filteredItems = {
					items: $scope.filteredItems
				};
				angular.element('#results-display').trigger('bcpl.filter.changed', filteredItems);
				//$scope.$apply();
			}, 250);
		};

		var init = function init() {
			cardService.get(function (data) {
				loadCardsAndFilters(data, setFiltersBasedOnQueryParams);
			});
		};


		init();
	};

	FilterPageCtrl.$inject = ['$location', '$scope', 'cardService', 'filterService', '$animate', '$timeout', 'CONSTANTS'];

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
			templateUrl: '/js/apps/filter-page/templates/filter.html',
			link: filterLink
		};

		return directive;
	};

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective() {
		var filterLink = function filterLink($scope) {
			var findFilterMatch = function findFilterMatch(tagName, filter) {
				return tagName.toLowerCase() === filter.toLowerCase();
			};

			$scope.$watch('filterData', function () {
				$scope.filterFamilies = $scope.filterData ? $scope.filterData.map(addFilterId) : $scope.filterFamilies;

				if ($scope.filterFamilies && $scope.filterFamilies.length) {
					$scope.filterFamilies.forEach(function (filterFamily) {
						var filterFamilyHasTags = filterFamily && Object.hasOwnProperty.call(filterFamily, 'tags') && filterFamily.tags.length;
						var tags = filterFamilyHasTags ? filterFamily.tags : [];
						var hasMatch = false;

						$scope.activeFilters.forEach(function (filter) {
							if (!hasMatch) {
								hasMatch = !!tags.filter(function (tagName) {
									return findFilterMatch(tagName, filter);
								}).length;
							}
						});

						filterFamily.isFilterActive = hasMatch;
					});
				}
			});

			var addFilterId = function addFilterId(filterFamily) {
				var newFamily = filterFamily;

				newFamily.name = newFamily.name === 'none' ? $scope.familyNameOverride : newFamily.name;

				if (newFamily) {
					newFamily.filterId = newFamily.name.replace(/[^\w]/g, '-');
				}
				return newFamily;
			};
		};

		var directive = {
			scope: {
				familyNameOverride: '@',
				isInitiallyExpanded: '@',
				filterHandler: '=',
				filterData: '=',
				activeFilters: '=',
				clearFilterFn: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/filters.html',
			link: filterLink
		};

		return directive;
	};

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app) {
	'use strict';

	var tagDirective = function tagDirective() {
		var tagLink = function filterLink($scope) {
			$scope.toggleFilter = function (activeFilter) {
				var activeTags = $scope.tagData.Tags.filter(function (tagInfo) {
					return tagInfo.Tag === activeFilter.Tag;
				});

				if (activeTags.length) {
					// One tag will only have one family, so unwrap it.
					$scope.filterHandler(activeFilter, activeTags[0]);
				}
			};
		};

		var directive = {
			scope: {
				filterHandler: '=',
				tagData: '=',
				activeFilters: '='
			},
			restrict: 'E',
			templateUrl: '/js/apps/filter-page/templates/tag.html',
			link: tagLink
		};

		return directive;
	};

	app.directive('tag', tagDirective);
})(angular.module('filterPageApp'));