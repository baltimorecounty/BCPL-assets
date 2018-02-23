'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedFilters', []);

	var filterHelpers = function filterHelpers($location) {
		var clearQueryParams = function clearQueryParams(key) {
			var newQueryParams = {};

			if (key) {
				var queryParams = $location.search();
				delete queryParams[key];
				newQueryParams = queryParams;
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

		//TODO: FILTERS MUST BE A STRING???
		var getFiltersFromString = function getFiltersFromString(filterStr, isDate) {
			if (!filterStr) return [];

			return filterStr && filterStr.indexOf(',') > -1 ? isDate ? filterStr : filterStr.split(',') : [filterStr];
		};

		var getQueryParams = function getQueryParams() {
			return $location.search();
		};

		var getQueryParamValuesByKey = function getQueryParamValuesByKey(queryParams, key, isDate) {
			return Object.hasOwnProperty.call(queryParams, key) ? getFiltersFromString(queryParams[key], isDate) : isDate ? "" : [];
		};

		var setQueryParams = function setQueryParams(key, val) {
			if (!key) return;

			var queryParam = $location.search();
			queryParam[key] = val;

			$location.search(queryParam);
		};

		var updateQueryParams = function updateQueryParams(key, val) {
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
					clearQueryParams(key);
				} else {
					setQueryParams(key, newFilterValues.join(","));
				}
			} else {
				setQueryParams(key, val);
			}
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