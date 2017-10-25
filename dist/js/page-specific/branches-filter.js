'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchesFilter = function ($, windowShade) {

	var dataLoader = function dataLoader(externalSuccessCallback, externalErrorCallback) {
		$.ajax('/mockups/data/branch-amenities.json').done(externalSuccessCallback).fail(externalErrorCallback);

		var filtersChangedEvent = document.createEvent('Event');
		filtersChangedEvent.initEvent('bcpl.locations.filter.changed', true, true);
	};

	return {
		dataLoader: dataLoader
	};
}(jQuery, bcpl.windowShade);

$(function () {
	bcpl.filter.init(bcpl.pageSpecific.branchesFilter.dataLoader);
});