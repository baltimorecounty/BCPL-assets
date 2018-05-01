namespacer('bcpl');

bcpl.tablenator = (($, _) => {
	const responsiveTableClass = 'tablenator-responsive-table';
	const tablenatorPrefix = 'tablenator-';
	let tablenatorOptions;
	let $originalTableCache;
	let breakpoint;

	const buildTwoColumnTables = ($headings, $dataRows) => {
		const newTableBodyCollection = [];

		if (!$headings || $headings.length === 0 || !$dataRows || $dataRows.length === 0) {
			return newTableBodyCollection;
		}

		$dataRows.each((rowIndex, rowElement) => {
			const $newTable = $(`<table class="${responsiveTableClass}" style="display:none"><tbody></tbody></table>`);
			const $newTableBody = $newTable.find('tbody');
			const $row = $(rowElement);

			$headings.each((headingIndex) => {
				const headingText = $headings.eq(headingIndex).text();
				let dataHtml = $row.find('td').eq(headingIndex).html().trim();

				const $dataHtml = $($.parseHTML(dataHtml));
				const $dataInput = $dataHtml.is('input')
					? $dataHtml
					: $dataHtml.find('input');

				if ($dataInput.length) {
					callFnOption(tablenatorOptions, 'onDataInput', $dataInput);
					dataHtml = $dataHtml && $dataHtml.length ? $dataHtml[0].outerHTML : '';
				}
				if (headingText && dataHtml) {
					$newTableBody.append(`<tr><td>${headingText}</td><td>${dataHtml}</td></tr>`);
				}
			});

			newTableBodyCollection.push($newTable);
		});

		return newTableBodyCollection;
	};

	const createMobileTables = (tableIndex, tableElement, callback) => {
		const $table = $(tableElement);
		const $headings = $table.find('th');
		const $dataRows = $table.find('tr').not($headings.closest('tr'));

		const newTableBodyCollection = buildTwoColumnTables($headings, $dataRows);

		newTableBodyCollection.reverse()
			.map(($newTable) => {
				if (tablenatorOptions.isParentForm) {
					return $originalTableCache
						.eq(tableIndex)
						.closest('form')
						.after($newTable);
				}
				return $originalTableCache
					.eq(tableIndex)
					.parent()
					.append($newTable);
			});

		$table.hide();

		if (callback && typeof callback === 'function') {
			callback();
		}
	};

	const windowResizehandler = (resizeEvent) => {
		const windowWidth = $(resizeEvent.target).width();

		if (windowWidth < breakpoint) {
			$originalTableCache.hide();
			$(`.${responsiveTableClass}`).show();

			callFnOption(tablenatorOptions, 'onMobileSize');
		} else {
			$originalTableCache.show();
			$(`.${responsiveTableClass}`).hide();

			callFnOption(tablenatorOptions, 'onDefaultSize');
		}
	};

	const hasProperty = (obj, propertyName) => obj && Object.prototype.hasOwnProperty.call(obj, propertyName);
	const setFnOption = (options, propertyName) => hasProperty(options, propertyName) ? options[propertyName] : null;
	const callFnOption = (options, propertyName, data) => {
		if (tablenatorOptions[propertyName] && typeof tablenatorOptions[propertyName] === 'function') {
			tablenatorOptions[propertyName](data, options);
		}
	};

	const setupOptions = (options) => {
		tablenatorOptions = options || {};
		tablenatorOptions.isParentForm = hasProperty(options, 'isParentForm')
			? options.isParentForm
			: false;
		tablenatorOptions.$originalTableCache = $originalTableCache;
		tablenatorOptions.tablenatorPrefix = tablenatorPrefix;
		tablenatorOptions.responsiveTableClass = responsiveTableClass;
		tablenatorOptions.afterInit = setFnOption(options, 'afterInit');
		tablenatorOptions.onMobileSize = setFnOption(options, 'onMobileSize');
		tablenatorOptions.onDefaultSize = setFnOption(options, 'onDefaultSize');
		tablenatorOptions.onDataInput = setFnOption(options, 'onDataInput');
	};

	const init = (tableSelector, screenBreakpoint, options) => {
		$originalTableCache = $(tableSelector);

		setupOptions(options);

		if (screenBreakpoint && typeof screenBreakpoint === 'number') {
			breakpoint = screenBreakpoint;
		} else {
			return;
		}

		if ($originalTableCache.length) {
			$originalTableCache.each((tableIndex, tableElement) => {
				createMobileTables(tableIndex, tableElement, () => {
					callFnOption(tablenatorOptions, 'afterInit', null);
				});
			});

			const lazyWindowResizeHandler = _.debounce(windowResizehandler, 100);
			$(window).on('resize', lazyWindowResizeHandler);
		}
	};

	return {
		/* test-code */
		buildTwoColumnTables,
		createMobileTables,
		windowResizehandler,
		/* end-test-code */
		init
	};
})(jQuery, _);
