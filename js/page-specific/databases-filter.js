namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.databaseFilter = (($) => {	
	const dataTableIndexes = {
		name: 0,
		url: 1,
		description: 2,
		inPerson: 3,
		requiresCard: 4,
		tags: 5
	};

	const dataLoaderSuccess = (data, externalSuccessCallback) => {
		const $dataTable = $(data).find('#data-table');
		const $rows = $dataTable.find('tbody tr');
		const databaseData = [];

		$rows.each((index, rowElement) => {
			const $row = $(rowElement);

			databaseData.push({
				name: $row.find('td').eq(dataTableIndexes.name).text(),
				url: $row.find('td').eq(dataTableIndexes.url).text(),
				description: $row.find('td').eq(dataTableIndexes.description).text(),
				inPerson: $row.find('td').eq(dataTableIndexes.inPerson).text(),
				requiresCard: $row.find('td').eq(dataTableIndexes.requiresCard).text(),
				tags: $row.find('td').eq(dataTableIndexes.tags).text().trim().split(', ')
			});
		});

		externalSuccessCallback(databaseData);
	};
	
	const dataLoader = (successCallback, errorCallback) => {
		$.ajax('/mockups/data/bcpl-databases.html')
			.done((data) => {
				dataLoaderSuccess(data, successCallback);
			})
			.fail(errorCallback);
	};

	return { dataLoader };
})(jQuery);

$(() => {
	bcpl.filter.init(bcpl.pageSpecific.databaseFilter.dataLoader);
});
