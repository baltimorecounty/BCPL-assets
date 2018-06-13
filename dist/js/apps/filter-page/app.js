'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedFilters', []);

	var filterHelpers = function filterHelpers($location) {
		var removeObjectByKey = function removeObjectByKey(key, obj) {
			var newObj = Object.assign({}, obj);
			if (key) {
				delete newObj[key];
			}
			return newObj;
		};

		var clearQueryParams = function clearQueryParams(keys) {
			if (!keys) {
				$location.search({});
				return;
			}

			var queryParams = Object.assign({}, $location.search());

			keys.forEach(function (key) {
				queryParams = removeObjectByKey(key, queryParams);
			});

			$location.search(queryParams);
		};

		var doesKeyExist = function doesKeyExist(queryParams, key) {
			if (!key) return false;

			var matches = Object.keys(queryParams).filter(function (paramKey) {
				return paramKey.toLowerCase() === key.toLowerCase();
			});

			return !!matches.length;
		};

		// TODO: FILTERS MUST BE A STRING???
		var getFiltersFromString = function getFiltersFromString(filterStr, isDate) {
			if (!filterStr) return [];

			return filterStr.indexOf(',') > -1 ? isDate ? filterStr : filterStr.split(',') : [filterStr];
		};

		var getQueryParams = function getQueryParams() {
			return $location.search();
		};

		var getQueryParamValuesByKey = function getQueryParamValuesByKey(queryParams, key, isDate) {
			return Object.hasOwnProperty.call(queryParams, key) ? getFiltersFromString(queryParams[key], isDate) : isDate ? '' : [];
		};

		var setQueryParams = function setQueryParams(keyValPairs) {
			keyValPairs.forEach(function (keyValPair) {
				var key = keyValPair.key,
				    val = keyValPair.val;


				if (!key) return;

				var queryParam = $location.search();
				queryParam[key] = val;

				$location.search(queryParam);
			});
		};

		var updateQueryParams = function updateQueryParams(keyValPairs) {
			var queryParams = getQueryParams();

			keyValPairs.forEach(function (keyValPair) {
				var key = keyValPair.key,
				    val = keyValPair.val;

				var doesQueryParamKeyExist = doesKeyExist(queryParams, key);

				if (doesQueryParamKeyExist) {
					var existingFilterValues = getQueryParamValuesByKey(queryParams, key);
					var shouldRemoveFilter = existingFilterValues.includes(val);
					var newFilterValues = [];

					if (shouldRemoveFilter) {
						var targetFilterIndex = existingFilterValues.indexOf(val);
						existingFilterValues.splice(targetFilterIndex, 1);
					} else {
						existingFilterValues.push(val);
					}

					newFilterValues = existingFilterValues;

					if (!newFilterValues.length) {
						clearQueryParams([key]);
					} else {
						setQueryParams([{
							key: key,
							val: newFilterValues.join(',')
						}]);
					}
				} else {
					setQueryParams([{ key: key, val: val }]);
				}
			});
		};

		return {
			clearQueryParams: clearQueryParams,
			doesKeyExist: doesKeyExist,
			getFiltersFromString: getFiltersFromString,
			getQueryParams: getQueryParams,
			getQueryParamValuesByKey: getQueryParamValuesByKey,
			setQueryParams: setQueryParams,
			updateQueryParams: updateQueryParams
		};
	};

	app.factory('sharedFilters.filterHelperService', ['$location', filterHelpers]);
})();
'use strict';

namespacer('bcpl');

// requires bootstrap.js to be included in the page
bcpl.boostrapCollapseHelper = function ($) {
	var toggleCollapseByIds = function toggleCollapseByIds(panels) {
		var activePanels = panels.activePanels,
		    inActivePanels = panels.inActivePanels;


		activePanels.forEach(function (id) {
			$('#' + id).collapse('show');
		});

		inActivePanels.forEach(function (id) {
			$('#' + id).collapse('hide');
		});
	};

	return {
		toggleCollapseByIds: toggleCollapseByIds
	};
}(jQuery);
'use strict';

(function () {
	'use strict';

	angular.module('filterPageApp', ['ngAnimate', 'ngAria']).config(function config($locationProvider) {
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
			databases: '/_js/apps/filter-page/templates/card-databases.html',
			locations: '/_js/apps/filter-page/templates/card-locations.html',
			filter: '/_js/apps/filter-page/templates/filter.html',
			filters: '/_js/apps/filter-page/templates/filters.html',
			tag: '/_js/apps/filter-page/templates/tag.html'
		},
		urls: {
			databases: 'https://services.bcpl.info/api/structured-content/databases',
			locations: '/sebin/q/r/branch-amenities.json'
		},
		filters: {
			tags: {
				types: {
					pickOne: 'one',
					pickMany: 'many'
				}
			}
		},
		analytics: {
			bcplLocationsCategory: 'BCPL Locations'
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
		var get = function get(afterDataLoadedCallback, filterType) {
			var dataService = $injector.get(filterType + 'Service');

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
					var attributeList = attribute.split('|');

					if (attributeList.length !== 3) console.error('The attribute was not specified, this must be fixed.');

					var tag = {
						Name: attributeList[0] || 'none',
						Tag: attributeList[1],
						Type: attributeList[2] || 'Many'
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

(function (app, googleAnalytics) {
	'use strict';

	var FilterPageCtrl = function FilterPageCtrl($scope, $document, $window, cardService, filterService, $animate, $timeout, CONSTANTS) {
		var vm = this;
		var trackEvent = googleAnalytics.trackEvent;


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
			publishLoadedCardsEvent();
		};

		vm.clearFilters = function () {
			vm.activeFilters = [];
			cycleDisplay();
			publishLoadedCardsEvent();

			trackEvent({
				action: 'Clear All Filters',
				category: CONSTANTS.analytics.bcplLocationsCategory
			});
		};

		vm.setFilterType = function (filterType) {
			vm.filterType = filterType;
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

		var cardsLoadedEvent = typeof Event === 'function' ? new $window.Event('bc-filter-cards-loaded') : undefined;

		var publishLoadedCardsEvent = function publishLoadedCardsEvent() {
			if (cardsLoadedEvent) {
				document.dispatchEvent(cardsLoadedEvent);
			} else {
				angular.element(document).trigger('bc-filter-cards-loaded');
			}
		};

		/**
   * Loads up the list of filters and all of the branch data.
   *
   * @param {[string]} filters
   * @param {[*]} branchData
   */
		var loadCardsAndFilters = function loadCardsAndFilters(cardData) {
			if (!cardData.length) {
				return;
			}

			var taggedCardData = Object.prototype.hasOwnProperty.call(cardData[0], 'Tags') ? cardData : filterService.transformAttributesToTags(cardData);

			vm.filters = filterService.build(taggedCardData);
			vm.allCardData = taggedCardData;
			vm.items = taggedCardData;
			angular.element('#results-display').trigger('bcpl.filter.changed', { items: vm.items });

			publishLoadedCardsEvent();
			$scope.$apply();
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

		$document.ready(function () {
			if (vm.filterType && typeof vm.filterType === 'string') {
				cardService.get(loadCardsAndFilters, vm.filterType);
			}
		});

	};

	FilterPageCtrl.$inject = ['$scope', '$document', '$window', 'cardService', 'filterService', '$animate', '$timeout', 'CONSTANTS'];

	app.controller('FilterPageCtrl', FilterPageCtrl);
})(angular.module('filterPageApp'), bcpl.utility.googleAnalytics);
'use strict';

(function (app, googleAnalytics) {
	'use strict';

	var trackEvent = googleAnalytics.trackEvent;


	var cardDirective = function cardDirective($compile, $injector, $templateRequest, CONSTANTS) {
		var cardLink = function cardLink($scope, element, attrs) {
			$templateRequest(CONSTANTS.templates[attrs.template]).then(function (html) {
				element.append($compile(html)($scope));
			});

			var continueToTargetLocation = function continueToTargetLocation(target) {
				if (target && target.href) {
					window.location = target.href;
				}
			};

			$scope.track = function (action, label, trackingEvent) {
				trackingEvent.preventDefault();

				trackEvent({
					action: action,
					category: CONSTANTS.analytics.bcplLocationsCategory,
					label: label
				});

				continueToTargetLocation(trackingEvent.currentTarget);
			};
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
})(angular.module('filterPageApp'), bcpl.utility.googleAnalytics);
'use strict';

(function (app, googleAnalytics) {
	'use strict';

	var trackEvent = googleAnalytics.trackEvent;


	var filterDirective = function filterDirective(CONSTANTS) {
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

				trackEvent({
					action: 'Filter Selection',
					category: CONSTANTS.analytics.bcplLocationsCategory,
					label: activeFilter + ' = ' + ($scope.isFilterChecked ? 'Selected' : 'Unselected')
				});
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
			templateUrl: CONSTANTS.templates.filter,
			link: filterLink
		};

		return directive;
	};

	filterDirective.$inject = ['CONSTANTS'];

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'), bcpl.utility.googleAnalytics);
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective(constants) {
		var filterLink = function filterLink($scope) {
			var findFilterMatch = function findFilterMatch(tagName, filter) {
				return tagName.toLowerCase() === filter.toLowerCase();
			};

			$scope.$watch('filterData', function () {
				$scope.filterFamilies = $scope.filterData ? $scope.filterData.map(addFilterId) : $scope.filterFamilies;

				if ($scope.filterFamilies && $scope.filterFamilies.length) {
					$scope.filterFamilies.forEach(function (filterFamily) {
						if (!filterFamily) return;

						var filterFamilyHasTags = Object.hasOwnProperty.call(filterFamily, 'tags') && filterFamily.tags.length;

						var tags = filterFamilyHasTags ? filterFamily.tags : [];
						var hasMatch = false;

						$scope.activeFilters.forEach(function (filter) {
							if (!hasMatch) {
								hasMatch = !!tags.filter(function (tagName) {
									return findFilterMatch(tagName, filter);
								}).length;
							}
						});

						// This should probably be refactored to be immutable
						filterFamily.isFilterActive = hasMatch; // eslint-disable-line no-param-reassign
					});
				}
			});

			var addFilterId = function addFilterId(filterFamily) {
				var newFamily = filterFamily;

				if (newFamily) {
					newFamily.name = newFamily.name === 'none' ? $scope.familyNameOverride : newFamily.name;
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
			templateUrl: constants.templates.filters,
			link: filterLink
		};

		return directive;
	};

	filtersDirective.$inject = ['CONSTANTS'];

	app.directive('filters', filtersDirective);
})(angular.module('filterPageApp'));
'use strict';

(function (app, googleAnalytics) {
	'use strict';

	var trackEvent = googleAnalytics.trackEvent;


	var tagDirective = function tagDirective(CONSTANTS) {
		var tagLink = function filterLink($scope) {
			$scope.toggleFilter = function (activeFilter) {
				var filterSelected = !$scope.activeFilters.includes(activeFilter.Tag);
				var activeTags = $scope.tagData.Tags.filter(function (tagInfo) {
					return tagInfo.Tag === activeFilter.Tag;
				});

				if (activeTags.length) {
					// One tag will only have one family, so unwrap it.
					$scope.filterHandler(activeFilter, activeTags[0]);
				}

				trackEvent({
					action: 'Filter Tag Selection',
					category: CONSTANTS.analytics.bcplLocationsCategory,
					label: $scope.tagData.name + ' ' + activeFilter.Tag + ' = ' + (filterSelected ? 'Selected' : 'Unselected')
				});
			};
		};

		var directive = {
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