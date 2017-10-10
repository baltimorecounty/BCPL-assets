namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchMap = (($) => {
	'use strict';

	let map;
	let markers = [];
	let infowindows = [];

	const getAddressForDirections = (branch) => {
		return [branch.address, branch.city, 'MD', branch.zip].join('+').replace(' ', '+');
	};

	const processBranchData = (branchData) => {
		branchData.forEach((branch) => {
			let infowindow = new google.maps.InfoWindow({
				content: '<div class="info-window"><h4>' + branch.name + ' Branch</h4><p><a href="https://maps.google.com?daddr=' + getAddressForDirections(branch) + '" target="_blank">Map it! <i class="fa fa-caret-right" aria-hidden="true"></i></a></p></div>'
			});

			infowindows.push(infowindow);

			let marker = new google.maps.Marker({
				position: {
					lat: parseFloat(branch.location.lat),
					lng: parseFloat(branch.location.lng)
				},
				map: map,
				title: branch.name,
				animation: google.maps.Animation.DROP
			});

			markers.push(marker);

			marker.addListener('click', () => {
				infowindow.open(map, marker);
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
			zoomControl: false,
			fullscreenControl: false
		});

		$.ajax('/mockups/data/branch-amenities.json')
			.done(processBranchData)
			.fail(reportBranchDataError);
	};

	return {
		initMap
	};
})(jQuery);
