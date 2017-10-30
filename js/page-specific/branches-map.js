namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchMap = (($) => {
	'use strict';

	let map;
	let markers = [];
	let infowindows = [];

	const getAddressForDirections = (branch) => {
		return [branch.address, branch.city, 'MD', branch.zip].join('+').replace(/\s/g, '+');
	};

	const addBranchToMap = (branch) => {
		if (branch.location) {
			let infowindow = new google.maps.InfoWindow({
				content: `<div class="info-window"><h4>${branch.name} Branch</h4><p><a href="https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=${getAddressForDirections(branch)}" target="_blank"><i class="fa fa-bus" aria-hidden="true"></i> Transit Directions </a><br/><a href="https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${getAddressForDirections(branch)}" target="_blank"><i class="fa fa-car" aria-hidden="true"></i> Driving Directions </a></p></div>`
			});

			infowindows.push(infowindow);

			const marker = new google.maps.Marker({
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
		}
	};

	const clearMarkers = () => {
		for (let i = 0, markerLength = markers.length; i < markerLength; i += 1) {
			markers[i].setMap(null);
		}

		markers = [];
	};

	const updateMapMarkers = (filterChangedEvent, filterData) => {
		clearMarkers();
		filterData.items.forEach(branch => addBranchToMap(branch));
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

		const layer = new google.maps.FusionTablesLayer({
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

		$(document).on('bcpl.filter.changed', '#results-display', updateMapMarkers);
	};

	return {
		/* test-code */
		getAddressForDirections,
		clearMarkers,
		/* end-test-code */
		initMap,
		markers
	};
})(jQuery);
