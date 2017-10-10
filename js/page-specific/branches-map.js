namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchMap = (($) => {
	'use strict';

	let map;

	const processBranchData = (branchData) => {
		branchData.forEach((branch) => {
			let marker = new google.maps.Marker({
				position: {
					lat: parseFloat(branch.location.lat),
					lng: parseFloat(branch.location.lng)
				},
				map: map,
				title: branch.name
			});
		});
	};

	const reportBranchDataError = (err) => {
		console.log(err);
	};

	const initMap = () => {
		map = new google.maps.Map(document.getElementById('location-map'), {
			center: {
				lat: 39.43,
				lng: -76.65
			},
			zoom: 10,
			mapTypeControl: false,
			streetViewControl: false,
			zoomControl: false
		});

		$.ajax('/mockups/data/branch-amenities.json')
			.done(processBranchData)
			.fail(reportBranchDataError);
	};

	return {
		initMap
	};
})(jQuery);
