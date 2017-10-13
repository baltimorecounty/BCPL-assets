'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchMap = function ($) {
	'use strict';

	var map = void 0;
	var markers = [];
	var infowindows = [];

	var getAddressForDirections = function getAddressForDirections(branch) {
		return [branch.address, branch.city, 'MD', branch.zip].join('+').replace(' ', '+');
	};

	var processBranchData = function processBranchData(branchData) {
		branchData.forEach(function (branch) {
			if (branch.location) {
				var infowindow = new google.maps.InfoWindow({
					content: '<div class="info-window"><h4>' + branch.name + ' Branch</h4><p><a href="https://maps.google.com?daddr=' + getAddressForDirections(branch) + '" target="_blank">Map it! <i class="fa fa-caret-right" aria-hidden="true"></i></a></p></div>'
				});

				infowindows.push(infowindow);

				var marker = new google.maps.Marker({
					position: {
						lat: parseFloat(branch.location.lat),
						lng: parseFloat(branch.location.lng)
					},
					map: map,
					title: branch.name,
					animation: google.maps.Animation.DROP
				});

				markers.push(marker);

				marker.addListener('click', function () {
					infowindow.open(map, marker);
				});
			}
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
			zoomControl: false,
			fullscreenControl: false
		});

		var layer = new google.maps.FusionTablesLayer({
			map: map,
			heatmap: { enabled: false },
			query: {
				select: 'col4',
				from: '1xdysxZ94uUFIit9eXmnw1fYc6VcQiXhceFd_CVKa',
				where: 'col6 \x3d \x2705000US24005\x27'
			},
			options: {
				styleId: 465,
				templateId: 499
			}
		});

		$.ajax('/mockups/data/branch-amenities.json').done(processBranchData).fail(reportBranchDataError);
	};

	return {
		initMap: initMap
	};
}(jQuery);