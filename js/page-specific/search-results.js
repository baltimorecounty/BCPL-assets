namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = (($, Handlebars, querystringer) => {
	const getMaterialTypeData = (processMaterialTypeCallback) => {
		$.ajax('http://ba224964:3000/data/primaryMaterialType.json').then(json => processMaterialTypeCallback(json), err => console.log(err));
	};

	const searchSuccessHandler = (data) => {
		getMaterialTypeData((materialTypes) => {
			_.map(data, (record) => {
				record.icon = materialTypes[_.findIndex(materialTypes, {
					id: parseInt(record.PrimaryTypeOfMaterial, 10),
				})].icon;
			});

			const source = $('#search-results-template').html();
			const template = Handlebars.compile(source);
			const html = template(data);
			$('#search-results').html(html);
		});
	};

	const searchErrorHandler = (err) => {
		console.log(err);
	};

	const resultCountButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		const selectedResultsPerPage = $button.attr('data-results-per-page');

		window.location = `${window.location.pathname}?q=${event.data.searchTerm}&page=${event.data.pageNumber}&resultsPerPage=${selectedResultsPerPage}`;
	};

	const pageButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		const selectedPageNumber = $button.attr('data-page-number');

		window.location = `${window.location.pathname}?q=${event.data.searchTerm}&page=${selectedPageNumber}&resultsPerPage=${event.data.resultsPerPage}`;
	};

	const init = () => {
		const querystring = querystringer.getAsDictionary();
		const searchTerm = querystring.q;
		const pageNumber = querystring.page;
		const resultsPerPage = querystring.resultsperpage;

		$(document).on('click', '#pager .results-per-page button', { searchTerm, pageNumber, resultsPerPage }, resultCountButtonClicked);
		$(document).on('click', '#pager .page-numbers button', { searchTerm, pageNumber, resultsPerPage }, pageButtonClicked);

		$.get(`http://ba224964:1000/api/polaris/search/${searchTerm}`).then(searchSuccessHandler, searchErrorHandler);
	};

	return {
		init,
	};
})(jQuery, Handlebars, bcpl.utility.querystringer);

$(() => {
	bcpl.pageSpecific.search.init();
});
