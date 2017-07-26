namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.filter = (($) => {
	let filterData = {};

	const render = (data, $template, $target) => {
		const source = $template.html();
		const template = Handlebars.compile(source);
		const html = template(data);
		$target.html(html);

		if ($target.not('.collapse').is(':hidden')) {
			$target.fadeIn(250);
		}
	};

	const generateAmenitiesList = (data) => {
		let amenities = [];

		_.each(data, (element) => {
			amenities = amenities.concat(element.amenities);
		});
		const uniqueAmenities = _.uniq(amenities);
		const sortedUniqueAmenities = _.sortBy(uniqueAmenities, ua => ({ ua }));

		return sortedUniqueAmenities;
	};

	const isIntersectedDataItem = (checkedAmenities, dataItem) => {
		const amenitiesIntersection = _.intersection(checkedAmenities, dataItem.amenities);

		return amenitiesIntersection.length === checkedAmenities.length;
	};

	const filterBoxChanged = () => {
		const checkedAmenities = [];
		const filteredData = [];
		const $labels = $('#amenities label');
		const $checkedAmenities = $labels.has('input:checked');

		$labels.not('input:checked').removeClass('active');
		$checkedAmenities.addClass('active');

		$checkedAmenities.each((index, amenityItem) => {
			checkedAmenities.push(amenityItem.innerText);
		});

		_.each(filterData, (dataItem) => {
			if (isIntersectedDataItem(checkedAmenities, dataItem)) {
				filteredData.push(dataItem);
			}
		});

		if (filteredData.length) {
			$('#branches').fadeOut(250, () => {
				render(filteredData, $('#branches-template'), $('#branches'));
			});
		}
	};

	const branchesJsonSuccess = (data) => {
		filterData = data;
		const amenities = generateAmenitiesList(data);
		render(data, $('#branches-template'), $('#branches'));
		render(amenities, $('#amenities-template'), $('#amenities'));

		$('#amenities input').on('change', filterBoxChanged);
	};

	const branchesJsonError = (jqxhr, status, errorThrown) => {
		console.log('err', errorThrown);
	};

	const toggleButtonClicked = (toggleButtonEvent) => {
		const $target = $(toggleButtonEvent.target);
		const $buttonGroup = $target.parent().find('button');
		const $branches = $('#branches');

		$buttonGroup.toggleClass('btn-primary').toggleClass('btn-default');

		if ($target.parent().is('#sort-control')) {
			$branches.fadeOut(250, () => {
				const $branchCards = $branches.find('.card').detach();
				$branches.append($branchCards.get().reverse());
				$branches.fadeIn(250);
			});
		}

		if ($target.parent().is('#list-grid-control')) {
			$branches.fadeOut(250, () => {
				$branches.toggleClass('list-view');
				$branches.fadeIn(250);
			});
		}
	};

	const init = () => {
		$.ajax('/mockups/data/branch-amenities.json').done(branchesJsonSuccess).fail(branchesJsonError);

		$('.filter-controls .btn-group-toggle').on('click', toggleButtonClicked);
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.pageSpecific.filter.init();
});
