'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedFilters', []);

	var filterHelpers = function filterHelpers($location) {
		var clearQueryParams = function clearQueryParams(keys) {
			var newQueryParams = {};

			if (keys) {
				var queryParams = $location.search();

				keys.forEach(function (key) {
					delete queryParams[key];
					newQueryParams = queryParams;
				});
			}

			$location.search(newQueryParams);
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

			return filterStr && filterStr.indexOf(',') > -1 ? isDate ? filterStr : filterStr.split(',') : [filterStr];
		};

		var getQueryParams = function getQueryParams() {
			return $location.search();
		};

		var getQueryParamValuesByKey = function getQueryParamValuesByKey(queryParams, key, isDate) {
			return Object.hasOwnProperty.call(queryParams, key) ? getFiltersFromString(queryParams[key], isDate) : isDate ? '' : [];
		};

		var setQueryParams = function setQueryParams(keyValueList) {
			if (!keyValueList) return;

			var queryParam = $location.search();

			keyValueList.forEach(function (item) {
				var key = item.key,
				    val = item.val;

				queryParam[key] = val;
			});

			$location.search(queryParam);
		};

		var updateQueryParams = function updateQueryParams(keyValueList) {
			if (!keyValueList) return;

			var paramsToUpdate = [];

			keyValueList.forEach(function (item) {
				var key = item.key,
				    val = item.val;

				var queryParams = getQueryParams();
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
						paramsToUpdate.push({
							key: key,
							val: newFilterValues.join(',')
						});
					}
				} else {
					paramsToUpdate.push({
						key: key,
						val: val
					});
				}
			});
			setQueryParams(paramsToUpdate);
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
	var toggleCollapseById = function toggleCollapseById(id) {
		$('#' + id).collapse('toggle');
	};

	return {
		toggleCollapseById: toggleCollapseById
	};
}(jQuery);