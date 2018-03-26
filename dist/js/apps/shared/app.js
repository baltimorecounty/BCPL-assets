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