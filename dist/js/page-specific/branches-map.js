'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.branchMap = function ($, googleAnalytics) {
	'use strict';

	var map = void 0;
	var markers = [];
	var infowindows = [];

	var getAddressForDirections = function getAddressForDirections(branch) {
		return [branch.address, branch.city, 'MD', branch.zip].join('+').replace(/\s/g, '+');
	};

	var addBranchToMap = function addBranchToMap(branch) {
		var trackEvent = googleAnalytics.trackEvent;


		if (branch.location) {
			var infowindow = new google.maps.InfoWindow({
				content: '<div class="info-window"><h4>' + branch.name + ' Branch</h4><p><a href="https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=' + getAddressForDirections(branch) + '" target="_blank"><i class="fa fa-bus" aria-hidden="true"></i> Transit Directions </a><br/><a href="https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + getAddressForDirections(branch) + '" target="_blank"><i class="fa fa-car" aria-hidden="true"></i> Driving Directions </a></p></div>'
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

				trackEvent({
					action: 'Map Marker Click',
					category: 'BCPL Locations',
					label: '' + branch.name
				});
			});
		}
	};

	var clearMarkers = function clearMarkers() {
		for (var i = 0, markerLength = markers.length; i < markerLength; i += 1) {
			markers[i].setMap(null);
		}

		markers = [];
	};

	var updateMapMarkers = function updateMapMarkers(filterChangedEvent, filterData) {
		clearMarkers();
		if (filterData && filterData.items) {
			filterData.items.forEach(function (branch) {
				return addBranchToMap(branch);
			});
		}
	};

	var initMap = function initMap() {
		// this is wrapped in a setTimeout to avoid a race condition
		$(function () {
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
		});

		$(document).on('bcpl.filter.changed', '#results-display', updateMapMarkers);
	};

	return {
		/* test-code */
		getAddressForDirections: getAddressForDirections,
		clearMarkers: clearMarkers,
		updateMapMarkers: updateMapMarkers,
		/* end-test-code */
		initMap: initMap,
		markers: markers
	};
}(jQuery, bcpl.utility.googleAnalytics);