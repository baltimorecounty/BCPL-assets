namespacer('bcpl');

bcpl.filter = (($, windowShade) => {
	let filterData = {};
	let filtersChangedEvent;

	const render = (data, $template, $target) => {
		const unsortedDataItems = data.items;
		const sortedDataItems = _.sortBy(unsortedDataItems, item => item.name);
		const dataForTemplate = data;
		dataForTemplate.items = sortedDataItems;
		const source = $template.html();
		const template = Handlebars.compile(source);
		const html = template(dataForTemplate);
		$target.html(html);

		if ($target.not('.collapse').is(':hidden')) {
			$target.fadeIn(250);
		}
	};

	const generateFiltersList = (data) => {
		let filters = [];

		_.each(data, (element) => {
			filters = filters.concat(element.attributes);
		});
		const uniqueFilters = _.uniq(filters);
		const sortedUniqueFilters = _.sortBy(uniqueFilters, uniqueFilter => uniqueFilter);

		return sortedUniqueFilters;
	};

	const isIntersectedDataItem = (checkedItems, dataItem) => {
		const intersection = _.intersection(checkedItems, dataItem.attributes);
		return intersection.length === checkedItems.length;
	};

	const filterBoxChanged = () => {
		const checkedFilters = [];
		const filteredData = [];
		const $labels = $('#filters label');
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
			items: filteredData,
			length: filteredData.length
		};

		$('#results-display')
			.trigger('bcpl.filter.changed', filterSettings)
			.fadeOut(250, () => {
				render(filterSettings, $('#results-display-template'), $('#results-display'));
			});
	};

	const filterDataSuccess = (contentData) => {	
		filterData = typeof contentData === 'string' ? JSON.parse(contentData) :contentData;
		
		render({
			items: filterData,
			length: filterData.length
		}, $('#results-display-template'), $('#results-display'));
		
		const filters = generateFiltersList(filterData);

		render(filters, $('#filters-template'), $('#filters'));

		$(document).on('change', '#filters input', filterBoxChanged);
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

		const filtersChangedEvent = document.createEvent('Event');
		filtersChangedEvent.initEvent('bcpl.filter.changed', true, true);

		$(document).on('show.bs.collapse', '#filters', filtersShowing);
		$(document).on('hide.bs.collapse', '#filters', filtersHiding); 
	};

	return { init };	
})(jQuery, bcpl.utility.windowShade);
