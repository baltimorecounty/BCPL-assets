'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedServices', ['sharedConstants']);

	var branchesService = function branchesService($q, $http, constants) {
		var getBranches = function getBranches() {
			var deferred = $q.defer();

			return $http.get(constants.urls.getBranches).then(function (resp) {
				return handleGetBranchesSuccess(resp, deferred);
			}).catch(function (error) {
				return handleFailedGetBranchesRequest(error, deferred);
			});
		};

		var handleGetBranchesSuccess = function handleGetBranchesSuccess(resp, deferred) {
			var dataToReturn = resp ? resp.data : "There was a problem getting data, please try again later.";
			deferred.resolve(dataToReturn);

			return deferred.promise;
		};

		var handleFailedGetBranchesRequest = function handleFailedGetBranchesRequest(error, deferred) {
			deferred.reject(error);
			return deferred.promise;
		};

		var getBranchesById = function getBranchesById(idList) {
			return getBranches().then(function (branches) {
				return branches.filter(function (branch) {
					return idList.includes(branch.id);
				});
			});
		};

		var getBranchesByName = function getBranchesByName(nameList) {
			return getBranches().then(function (branches) {
				return branches.filter(function (branch) {
					return nameList.map(function (branch) {
						return branch.toLowerCase();
					}).includes(branch.name.toLowerCase());
				});
			});
		};

		return {
			getBranchesById: getBranchesById,
			getBranchesByName: getBranchesByName
		};
	};

	app.factory('sharedServices.branchesService', ['$q', '$http', 'sharedConstants.CONSTANTS', branchesService]);
})();
'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedConstants', []);

	var constants = {
		urls: {
			getBranches: 'data/branch-amenities.json'
		}
	};

	app.constant('sharedConstants.CONSTANTS', constants);
})();
'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedFilters', []);

	var filterHelpers = function filterHelpers($location) {
		var clearQueryParams = function clearQueryParams(key) {
			$location.search({});
		};

		var doesKeyExist = function doesKeyExist(queryParams, key) {
			if (!key) return false;

			var matches = Object.keys(queryParams).filter(function (paramKey) {
				return paramKey.toLowerCase() === key.toLowerCase();
			});

			return !!matches.length;
		};

		//TODO: FILTERS MUST BE A STRING???
		var getFiltersFromString = function getFiltersFromString(filterStr) {
			if (!filterStr) return [];

			return filterStr && filterStr.indexOf(',') > -1 ? filterStr.split(',') : [filterStr];
		};

		var getQueryParams = function getQueryParams() {
			return $location.search();
		};

		var getQueryParamValuesByKey = function getQueryParamValuesByKey(queryParams, key) {
			return Object.hasOwnProperty.call(queryParams, key) ? getFiltersFromString(queryParams[key]) : [];
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
					clearQueryParams();
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
			getQueryParamValuesByKey: getQueryParamValuesByKey,
			setQueryParams: setQueryParams,
			updateQueryParams: updateQueryParams
		};
	};

	app.factory('sharedFilters.filterHelperService', ['$location', filterHelpers]);
})();