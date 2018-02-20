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