'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.databaseFilter = function ($) {
	var dataTableIndexes = {
		name: 0,
		url: 1,
		description: 2,
		inPerson: 3,
		requiresCard: 4,
		attributes: 5
	};

	var dataLoaderSuccess = function dataLoaderSuccess(data, externalSuccessCallback) {
		var $dataTable = $(data).find('#data-table');
		var $rows = $dataTable.find('tbody tr');
		var databaseData = [];

		$rows.each(function (index, rowElement) {
			var $row = $(rowElement);

			databaseData.push({
				name: $row.find('td').eq(dataTableIndexes.name).text(),
				url: $row.find('td').eq(dataTableIndexes.url).text(),
				description: $row.find('td').eq(dataTableIndexes.description).text(),
				inPerson: $row.find('td').eq(dataTableIndexes.inPerson).text(),
				requiresCard: $row.find('td').eq(dataTableIndexes.requiresCard).text(),
				attributes: $row.find('td').eq(dataTableIndexes.attributes).text().trim().split(', ')
			});
		});

		externalSuccessCallback(databaseData);
	};

	var dataLoader = function dataLoader(successCallback, errorCallback) {
		$.ajax('/mockups/data/bcpl-databases.html').done(function (data) {
			dataLoaderSuccess(data, successCallback);
		}).fail(errorCallback);
	};

	return { dataLoader: dataLoader };
}(jQuery);

$(function () {
	bcpl.filter.init(bcpl.pageSpecific.databaseFilter.dataLoader);
});