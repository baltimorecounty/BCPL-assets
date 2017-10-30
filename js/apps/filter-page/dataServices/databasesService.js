((app) => {
	const databasesService = () => {
		const template = '' +
			'<div class="card">' +
			'	<div class="row">' +
			'		<div class="col-sm-12 branch-address">' +
			'			<h4>' +
			'				<a href="#">{{cardData.name}}</a>' +
			'			</h4>' +
			'			<p>{{cardData.description}}</p>' +
			'			<div class="tags">Categories:' +
			'				<ul class="tag-list">' +
			'					<tag tag-data="cardData.attributes" active-filters="activeFilters" filter-handler="filterHandler"></tag>' +
			'				</ul>' +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>';

		const dataTableIndexes = {
			name: 0,
			url: 1,
			description: 2,
			inPerson: 3,
			requiresCard: 4,
			attributes: 5
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
					attributes: $row.find('td').eq(dataTableIndexes.attributes).text().trim().split(', ')
				});
			});

			externalSuccessCallback(databaseData);
		};

		const get = (successCallback, errorCallback) => {
			$.ajax('/mockups/data/bcpl-databases.html')
				.done((data) => {
					dataLoaderSuccess(data, successCallback);
				})
				.fail(errorCallback);
		};

		return {
			template,
			get
		};
	};

	app.factory('databasesService', databasesService);
})(angular.module('filterPageApp'));
