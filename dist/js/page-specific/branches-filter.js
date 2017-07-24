'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.filter = function ($) {
	var render = function render(data, $template, $target) {
		var source = $template.html();
		var template = Handlebars.compile(source);
		var html = template(data);
		$target.html(html);
	};

	var generateAmenitiesList = function generateAmenitiesList(data) {
		var amenities = [];

		_.each(data, function (element) {
			amenities.concat(element.amenities);
		});

		var uniqueAmenities = _.uniq(amenities);

		console.log(uniqueAmenities);
	};

	var branchesJsonSuccess = function branchesJsonSuccess(data) {
		var amenities = generateAmenitiesList(data);
		render(data, $('#branches-template'), $('#branches'));
		render(amenities, $('#amenities-template'), $('#amenities'));
	};

	var branchesJsonError = function branchesJsonError(err) {
		console.log(err);
	};

	var init = function init() {
		$.getJSON('/mockups/data/branch-amenities.json').done(branchesJsonSuccess, branchesJsonError);
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.pageSpecific.filter.init();
});