'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.filter = function ($, windowShade) {
	var filterData = {};
	var filtersChangedEvent = void 0;

	var render = function render(data, $template, $target) {
		var source = $template.html();
		var template = Handlebars.compile(source);
		var html = template(data);
		$target.html(html);

		if ($target.not('.collapse').is(':hidden')) {
			$target.fadeIn(250);
		}
	};

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

	var isIntersectedDataItem = function isIntersectedDataItem(checkedAmenities, dataItem) {
		var amenitiesIntersection = _.intersection(checkedAmenities, dataItem.amenities);

		return amenitiesIntersection.length === checkedAmenities.length;
	};

	var filterBoxChanged = function filterBoxChanged() {
		var checkedAmenities = [];
		var filteredData = [];
		var $labels = $('#amenities label');
		var $checkedAmenities = $labels.has('input:checked');

		$labels.not('input:checked').removeClass('active');
		$checkedAmenities.addClass('active');

		$checkedAmenities.each(function (index, amenityItem) {
			checkedAmenities.push(amenityItem.innerText);
		});

		_.each(filterData, function (dataItem) {
			if (isIntersectedDataItem(checkedAmenities, dataItem)) {
				filteredData.push(dataItem);
			}
		});

		windowShade.cycle(250, 2000);

		var filterSettings = {
			branches: filteredData,
			length: filteredData.length
		};

		$('#branches').trigger('bcpl.locations.filter.changed', filterSettings).fadeOut(250, function () {
			render(filterSettings, $('#branches-template'), $('#branches'));
		});
	};

	var branchesJsonSuccess = function branchesJsonSuccess(data) {
		filterData = typeof data === 'string' ? JSON.parse(data) : data;
		var amenities = generateAmenitiesList(filterData);
		render({
			branches: filterData,
			length: filterData.length
		}, $('#branches-template'), $('#branches'));
		render(amenities, $('#amenities-template'), $('#amenities'));

		$('#amenities input').on('change', filterBoxChanged);
	};

	var branchesJsonError = function branchesJsonError(jqxhr, status, errorThrown) {
		console.log('err', errorThrown);
	};

	var amenitiesShowing = function amenitiesShowing(collapseEvent) {
		$(collapseEvent.currentTarget).siblings('.collapse-control').html('<i class="fa fa-minus"></i> Hide Filters');
	};

	var amenitiesHiding = function amenitiesHiding(collapseEvent) {
		$(collapseEvent.currentTarget).siblings('.collapse-control').html('<i class="fa fa-plus"></i> Show Filters');
	};

	var init = function init() {
		$.ajax('/mockups/data/branch-amenities.json').done(branchesJsonSuccess).fail(branchesJsonError);

		filtersChangedEvent = document.createEvent('Event');
		filtersChangedEvent.initEvent('bcpl.locations.filter.changed', true, true);

		$(document).on('show.bs.collapse', '#amenities', amenitiesShowing);
		$(document).on('hide.bs.collapse', '#amenities', amenitiesHiding);
	};

	return { init: init };
}(jQuery, bcpl.windowShade);

$(function () {
	bcpl.pageSpecific.filter.init();
});