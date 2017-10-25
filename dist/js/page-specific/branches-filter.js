'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchesFilter = function ($, windowShade) {

	var generateAmenitiesList = function generateAmenitiesList(data) {
		var amenities = [];

		_.each(data, function (element) {
			amenities = amenities.concat(element.amenities);
		});
		var uniqueAmenities = _.uniq(amenities);
		var sortedUniqueAmenities = _.sortBy(uniqueAmenities, function (ua) {
			return ua;
		});

		return sortedUniqueAmenities;
	};

	var branchDataLoadedSuccess = function branchDataLoadedSuccess(branchData, externalSuccessCallback) {
		var amenitiesList = generateAmenitiesList(branchData);

		externalSuccessCallback(branchData, amenitiesList);
	};

	var dataLoader = function dataLoader(externalSuccessCallback, externalErrorCallback) {
		$.ajax('/mockups/data/branch-amenities.json').done(function (branchData) {
			branchDataLoadedSuccess(branchData, externalSuccessCallback);
		}).fail(externalErrorCallback);

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