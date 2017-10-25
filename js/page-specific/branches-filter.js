namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchesFilter = (($, windowShade) => {

	const generateAmenitiesList = (data) => {
		let amenities = [];

		_.each(data, (element) => {
			amenities = amenities.concat(element.amenities);
		});
		const uniqueAmenities = _.uniq(amenities);
		const sortedUniqueAmenities = _.sortBy(uniqueAmenities, ua => ua);

		return sortedUniqueAmenities;
	};

	const branchDataLoadedSuccess = (branchData, externalSuccessCallback) => {
		var amenitiesList = generateAmenitiesList(branchData);

		externalSuccessCallback(branchData, amenitiesList);
	};

	const dataLoader = (externalSuccessCallback, externalErrorCallback) => {
		$.ajax('/mockups/data/branch-amenities.json')
			.done((branchData) => {
				branchDataLoadedSuccess(branchData, externalSuccessCallback);
			})
			.fail(externalErrorCallback);

		const filtersChangedEvent = document.createEvent('Event');
		filtersChangedEvent.initEvent('bcpl.locations.filter.changed', true, true);
	};

	return {
		dataLoader
	};
})(jQuery, bcpl.windowShade);

$(() => {
	bcpl.filter.init(bcpl.pageSpecific.branchesFilter.dataLoader);
});
