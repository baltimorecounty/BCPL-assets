'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.filter = function ($) {
	var filterData = {};

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
			return { ua: ua };
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

		if (filteredData.length) {
			$('#branches').fadeOut(250, function () {
				render(filteredData, $('#branches-template'), $('#branches'));
			});
		}
	};

	var branchesJsonSuccess = function branchesJsonSuccess(data) {
		filterData = data;
		var amenities = generateAmenitiesList(data);
		render(data, $('#branches-template'), $('#branches'));
		render(amenities, $('#amenities-template'), $('#amenities'));

		$('#amenities input').on('change', filterBoxChanged);
	};

	var branchesJsonError = function branchesJsonError(jqxhr, status, errorThrown) {
		console.log('err', errorThrown);
	};

	var toggleButtonClicked = function toggleButtonClicked(toggleButtonEvent) {
		var $target = $(toggleButtonEvent.target);
		var $buttonGroup = $target.parent().find('button');
		var $branches = $('#branches');

		$buttonGroup.toggleClass('btn-primary').toggleClass('btn-default');

		if ($target.parent().is('#sort-control')) {
			$branches.fadeOut(250, function () {
				var $branchCards = $branches.find('.card').detach();
				$branches.append($branchCards.get().reverse());
				$branches.fadeIn(250);
			});
		}

		if ($target.parent().is('#list-grid-control')) {
			$branches.fadeOut(250, function () {
				$branches.toggleClass('list-view');
				$branches.fadeIn(250);
			});
		}
	};

	var init = function init() {
		$.ajax('/mockups/data/branch-amenities.json').done(branchesJsonSuccess).fail(branchesJsonError);

		$('.filter-controls .btn-group-toggle').on('click', toggleButtonClicked);
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.pageSpecific.filter.init();
});