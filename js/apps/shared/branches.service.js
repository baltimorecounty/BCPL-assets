(() => {
	'use strict';

	const app = angular.module('sharedServices', ['sharedConstants']);

	const branchesService = ($q, $http, constants) => {
		const getBranches = () => {
			var deferred = $q.defer();

			return $http.get(constants.urls.getBranches)
				.then((resp) => handleGetBranchesSuccess(resp, deferred))
				.catch((error) => handleFailedGetBranchesRequest(error, deferred));
		};

		const handleGetBranchesSuccess = (resp, deferred) => {
			const dataToReturn = resp ? resp.data : "There was a problem getting data, please try again later.";
			deferred.resolve(dataToReturn);

			return deferred.promise;
		};

		const handleFailedGetBranchesRequest = (error, deferred) => {
			deferred.reject(error);
			return deferred.promise;
		};

		const getBranchesById = (idList) => getBranches()
				.then(branches => branches.filter(branch => idList.includes(branch.id)));

		const getBranchesByName = (nameList) => getBranches()
			.then((branches) => branches.filter(branch => 
				nameList.map(branch => branch.toLowerCase())
					.includes(branch.name.toLowerCase())));

		return {
			getBranchesById,
			getBranchesByName,
		};
	};


	app.factory('sharedServices.branchesService', ['$q', '$http', 'sharedConstants.CONSTANTS', branchesService]);
})();
