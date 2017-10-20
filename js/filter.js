namespacer('bcpl');

bcpl.filter = (($, windowShade) => {
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

	const isIntersectedDataItem = (checkedItems, dataItem) => {
		const intersection = _.intersection(checkedItems, dataItem.tags);
		return intersection.length === checkedItems.length;
	};

	const filterBoxChanged = () => {
		const checkedFilters = [];
		const filteredData = [];
		const $labels = $('#filter-list label');
		const $checkedFilters = $labels.has('input:checked');

		$labels.not('input:checked').removeClass('active');
		$checkedFilters.addClass('active');

		$checkedFilters.each((index, filterItem) => {
			checkedFilters.push(filterItem.innerText);
		});

		_.each(filterData, (dataItem) => {
			if (isIntersectedDataItem(checkedFilters, dataItem)) {
				filteredData.push(dataItem);
			}
		});

		windowShade.cycle(250, 2000);

		const filterSettings = {
			branches: filteredData,
			length: filteredData.length
		};

		$('#branches')
			.trigger('bcpl.filter.changed', filterSettings)
			.fadeOut(250, () => {
				render(filterSettings, $('#filter-display-template'), $('#filter-display'));
			});
	};

	const filterDataSuccess = (data) => {
		data = [{
			name: 'Database 1',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
			tags: ['business', 'adult', 'do it yourself']
		}, {
			name: 'Database 2',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
			tags: ['business', 'teens', 'do it yourself']
		}, {
			name: 'Database 3',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
			tags: ['business', 'youth', 'do it yourself']
		}, {
			name: 'Database 4',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
			tags: ['business', 'adult', 'do it yourself']
		}, {
			name: 'Database 5',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
			tags: ['business', 'adult', 'do it yourself']
		}];

		filterData = typeof data === 'string' ? JSON.parse(data) : data;

		//const amenities = generateAmenitiesList(filterData);
		
		render({
			items: filterData,
			length: filterData.length
		}, $('#results-display-template'), $('#results-display'));
		
		//render(amenities, $('#amenities-template'), $('#amenities'));

		//$('#amenities input').on('change', filterBoxChanged);
	};

	const filterDataError = (jqxhr, status, errorThrown) => {
		console.log('err', errorThrown);
	};

	const filtersShowing = (collapseEvent) => {
		$(collapseEvent.currentTarget)
			.siblings('.collapse-control')
			.html('<i class="fa fa-minus"></i> Hide Filters');
	};

	const filtersHiding = (collapseEvent) => {
		$(collapseEvent.currentTarget)
			.siblings('.collapse-control')
			.html('<i class="fa fa-plus"></i> Show Filters');
	};

	const init = () => {
		//$.ajax('/mockups/data/branch-amenities.json').done(filterDataSuccess).fail(branchesJsonError);
		filterDataSuccess();

		/* filtersChangedEvent = document.createEvent('Event');
		filtersChangedEvent.initEvent('bcpl.locations.filter.changed', true, true);
*/
		$(document).on('show.bs.collapse', '#filter-list', filtersShowing);
		$(document).on('hide.bs.collapse', '#filter-list', filtersHiding); 
	};

	return { init };	
})(jQuery, bcpl.windowShade);

$(() => {
	bcpl.filter.init();
});
