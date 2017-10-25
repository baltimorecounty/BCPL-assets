namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchesFilter = (($, windowShade) => {

	const dataLoader = (externalSuccessCallback, externalErrorCallback) => {
		$.ajax('/mockups/data/branch-amenities.json')
			.done(externalSuccessCallback)
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
