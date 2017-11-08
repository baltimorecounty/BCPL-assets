((app) => {
	const databasesService = (CONSTANTS) => {
		const dataTableIndexes = {
			name: 0,
			url: 1,
			description: 2,
			inPerson: 3,
			requiresCard: 4,
			attributes: 5
		};

		const arrayifyAttributes = ($tags) => {
			let tagArray = [];

			$tags.each((index, tagElement) => {
				const tagText = $(tagElement).text().trim();
				if (tagText.length) {
					tagArray.push(tagText);
				}
			});

			return tagArray;
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
					attributes: arrayifyAttributes($row.find('td').eq(dataTableIndexes.attributes).find('.SETags'))
				});
			});

			externalSuccessCallback(databaseData);
		};

		const get = (successCallback, errorCallback) => {
			$.ajax(CONSTANTS.urls.databases)
				.done((data) => {
					dataLoaderSuccess(data, successCallback);
				})
				.fail(errorCallback);
		};

		return {
			get
		};
	};

	databasesService.$inject = ['CONSTANTS'];

	app.factory('databasesService', databasesService);
})(angular.module('filterPageApp'));
