'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchesFilter = function ($) {
	var dataLoader = function dataLoader(externalSuccessCallback, externalErrorCallback) {
		$.ajax('/mockups/data/branch-amenities.json').done(externalSuccessCallback).fail(externalErrorCallback);
	};

	return {
		dataLoader: dataLoader
	};
}(jQuery, bcpl.windowShade);