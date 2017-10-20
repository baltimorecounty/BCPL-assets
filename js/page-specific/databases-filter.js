namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.filter = (($, windowShade) => {
	let filterData = {};
	let filtersChangedEvent;

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
		const sortedUniqueAmenities = _.sortBy(uniqueAmenities, ua => ua);

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

		windowShade.cycle(250, 2000);

		const filterSettings = {
			branches: filteredData,
			length: filteredData.length
		};

		$('#branches')
			.trigger('bcpl.locations.filter.changed', filterSettings)
			.fadeOut(250, () => {
				render(filterSettings, $('#branches-template'), $('#branches'));
			});
	};

	const branchesJsonSuccess = (data) => {
		filterData = typeof data === 'string' ? JSON.parse(data) : data;
		const amenities = generateAmenitiesList(filterData);
		render({
			branches: filterData,
			length: filterData.length
		}, $('#branches-template'), $('#branches'));
		render(amenities, $('#amenities-template'), $('#amenities'));

		$('#amenities input').on('change', filterBoxChanged);
	};

	const branchesJsonError = (jqxhr, status, errorThrown) => {
		console.log('err', errorThrown);
	};

	const amenitiesShowing = (collapseEvent) => {
		$(collapseEvent.currentTarget)
			.siblings('.collapse-control')
			.html('<i class="fa fa-minus"></i> Hide Filters');
	};

	const amenitiesHiding = (collapseEvent) => {
		$(collapseEvent.currentTarget)
			.siblings('.collapse-control')
			.html('<i class="fa fa-plus"></i> Show Filters');
	};

	const init = () => {
		$.ajax('/mockups/data/branch-amenities.json').done(branchesJsonSuccess).fail(branchesJsonError);

		filtersChangedEvent = document.createEvent('Event');
		filtersChangedEvent.initEvent('bcpl.locations.filter.changed', true, true);

		$(document).on('show.bs.collapse', '#amenities', amenitiesShowing);
		$(document).on('hide.bs.collapse', '#amenities', amenitiesHiding);
	};

	return { init };
})(jQuery, bcpl.windowShade);

$(() => {
	bcpl.pageSpecific.filter.init();
});
