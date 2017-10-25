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

		$('#results-display')
			.trigger('bcpl.filter.changed', filterSettings)
			.fadeOut(250, () => {
				render(filterSettings, $('#results-display-template'), $('#results-display'));
			});
	};

	const filterDataSuccess = (contentData, filters) => {	
		filterData = typeof contentData === 'string' ? JSON.parse(contentData) :contentData;
		
		render({
			items: filterData,
			length: filterData.length
		}, $('#results-display-template'), $('#results-display'));
		
		render(filters, $('#filters-template'), $('#filters'));

		$('#filter-list input').on('change', filterBoxChanged);
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

	const init = (dataLoadingFunction) => {
		dataLoadingFunction(filterDataSuccess, filterDataError);

		$(document).on('show.bs.collapse', '#filter-list', filtersShowing);
		$(document).on('hide.bs.collapse', '#filter-list', filtersHiding); 
	};

	return { init };	
})(jQuery, bcpl.windowShade);
