namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.filter = (($) => {
	const render = (data, $template, $target) => {
		const source = $template.html();
		const template = Handlebars.compile(source);
		const html = template(data);
		$target.html(html);
	};

	const generateAmenitiesList = (data) => {
		const amenities = [];

		_.each(data, (element) => {
			amenities.concat(element.amenities);
		});

		const uniqueAmenities = _.uniq(amenities);

		console.log(uniqueAmenities);
	};

	const branchesJsonSuccess = (data) => {
		const amenities = generateAmenitiesList(data);
		render(data, $('#branches-template'), $('#branches'));
		render(amenities, $('#amenities-template'), $('#amenities'));
	};

	const branchesJsonError = (err) => {
		console.log(err);
	};

	const init = () => {
		$.getJSON('/mockups/data/branch-amenities.json')
			.done(branchesJsonSuccess, branchesJsonError);
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.pageSpecific.filter.init();
});
