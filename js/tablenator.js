namespacer('bcpl');

bcpl.tablenator = (($, _) => {
	let $originalTableCache;
	let breakpoint;

	const buildTwoColumnTables = ($headings, $dataRows) => {
		const newTableBodyCollection = [];

		if (!$headings || $headings.length === 0 || !$dataRows || $dataRows.length === 0) {
			return newTableBodyCollection;
		}

		$dataRows.each((rowIndex, rowElement) => {
			const $newTable = $('<table class="tablenator-responsive-table"><tbody></tbody><table>');
			const $newTableBody = $newTable.find('tbody');
			const $row = $(rowElement);

			$headings.each((headingIndex) => {
				const headingText = $headings.eq(headingIndex).text();
				const dataHtml = $row.find('td').eq(headingIndex).html();

				$newTableBody.append(`<tr><td>${headingText}</td><td>${dataHtml}</td></tr>`);
			});

			newTableBodyCollection.push($newTable);
		});

		return newTableBodyCollection;
	};

	const reformat = (tableIndex, tableElement) => {
		const $table = $(tableElement);
		const $headings = $table.find('th');
		const $dataRows = $table.find('tr').not($headings.closest('tr'));

		const newTableBodyCollection = buildTwoColumnTables($headings, $dataRows);

		newTableBodyCollection.map(($newTable) =>
			$originalTableCache
				.eq(tableIndex)
				.parent()
				.append($newTable));

		$table.detach();
	};

	const windowResizehandler = (resizeEvent) => {
		const windowWidth = $(resizeEvent.target).width();

		if (windowWidth < breakpoint) {
			$originalTableCache.each(reformat);
		} else {
			const parentCollection = $('.tablenator-responsive-table').map((index, tableElement) => $(tableElement).parent().get());

			$.unique(parentCollection).each((index, parentElement) => $(parentElement).empty().append($originalTableCache.eq(index)));
		}
	};

	const init = (tableSelector, screenBreakpoint) => {
		$originalTableCache = $(tableSelector);

		if (screenBreakpoint && typeof screenBreakpoint === 'number') {
			breakpoint = screenBreakpoint;
		} else {
			return;
		}

		if ($originalTableCache.length) {
			const lazyWindowResizeHandler = _.debounce(windowResizehandler, 100);
			$(window).on('resize', lazyWindowResizeHandler);
		}
	};

	return {
		/* test-code */
		buildTwoColumnTables,
		reformat,
		windowResizehandler,
		/* end-test-code */
		init
	};
})(jQuery, _);
