'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchMap = function ($) {
	'use strict';

	var map = void 0;

	var processBranchData = function processBranchData(branchData) {
		branchData.forEach(function (branch) {
			var marker = new google.maps.Marker({
				position: {
					lat: parseFloat(branch.location.lat),
					lng: parseFloat(branch.location.lng)
				},
				map: map,
				title: branch.name
			});
		});
	};

	var reportBranchDataError = function reportBranchDataError(err) {
		console.log(err);
	};

	var initMap = function initMap() {
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

		$.ajax('/mockups/data/branch-amenities.json').done(processBranchData).fail(reportBranchDataError);
	};

	return {
		initMap: initMap
	};
}(jQuery);