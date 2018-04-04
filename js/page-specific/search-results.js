namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = (($, Handlebars, querystringer, CONSTANTS) => {
	const getMaterialTypeData = (processMaterialTypeCallback) => {
		$.ajax(CONSTANTS.search.urls.materialTypes)
			.then(json => processMaterialTypeCallback(json), err => console.log(err));
	};

	const buildArrayFromRange = (start, end, current) =>
		Array.from({ length: (end - start) + 1 }, (value, key) =>
			({ page: (key + start), isCurrent: (key + start) === current }));

	const getPageNumbers = (current, max) => {
		if (max <= 1 || max < current) return 1;

		const difference = max - current;

		if (current <= 3 && max <= 5) return buildArrayFromRange(1, max, current);

		if (current <= 3 && max >= 5) return buildArrayFromRange(1, 5, current);

		if (difference >= 2) return buildArrayFromRange(current - 2, current + 2, current);

		if (max <= 5) return buildArrayFromRange(1, max, current);

		return buildArrayFromRange(max - 4, max, current);
	};

	const searchSuccessHandler = (data) => {
		const templateData = data;

		if (templateData.SearchResults.length > 0) {
			templateData.ResultsPerPageButtons = [
				{ count: 10, isCurrent: data.ResultsPerPage === 10 },
				{ count: 25, isCurrent: data.ResultsPerPage === 25 },
				{ count: 50, isCurrent: data.ResultsPerPage === 50 },
				{ count: 100, isCurrent: data.ResultsPerPage === 100 }
			];

			templateData.PageNumbers = getPageNumbers(templateData.CurrentPage, templateData.Pages);

			getMaterialTypeData((materialTypes) => {
				const recordsWithIcons = [];
				_.map(templateData.SearchResults, (record) => {
					const recordWithIcon = record;
					recordWithIcon.icon = materialTypes[_.findIndex(materialTypes, {
						id: parseInt(record.PrimaryTypeOfMaterial, 10)
					})].icon;
					recordsWithIcons.push(recordWithIcon);
				});

				templateData.SearchResults = recordsWithIcons;

				const source = $('#search-results-template').html();
				const template = Handlebars.compile(source);
				const html = template(templateData);
				$('.loading').hide();
				$('#search-results').html(html);
			});
		} else {
			$('.no-results').show();
		}
	};

	const searchErrorHandler = (err) => {
		console.log(err);
	};

	const loadSearchPage = (searchTerm, pageNumber, selectedResultsPerPage) => {
		window.location = `${window.location.pathname}?q=${searchTerm}&page=${pageNumber}&resultsPerPage=${selectedResultsPerPage}`;
	};

	const resultCountButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		const selectedResultsPerPage = $button.attr('data-results-per-page');

		loadSearchPage(event.data.searchTerm, event.data.pageNumber, selectedResultsPerPage);
	};

	const pageButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		const selectedPageNumber = $button.attr('data-page-number');

		loadSearchPage(event.data.searchTerm, selectedPageNumber, event.data.selectedResultsPerPage);
	};

	const init = () => {
		const querystring = querystringer.getAsDictionary();

		if (querystring.q) {
			const searchTerm = querystring.q.trim();
			const pageNumber = querystring.page ? querystring.page : 1;
			const resultsPerPage = querystring.resultsperpage ? querystring.resultsperpage : 10;

			$(document).on('click', '#pager .results-per-page button', { searchTerm, pageNumber, resultsPerPage }, resultCountButtonClicked);
			$(document).on('click', '#pager .page-numbers button', { searchTerm, pageNumber, resultsPerPage }, pageButtonClicked);

			$.get(`${bcpl.constants.baseApiUrl}/api/polaris/search/${searchTerm}/${pageNumber}/${resultsPerPage}`).then(searchSuccessHandler, searchErrorHandler);
		} else {
			$('.loading').hide();
			$('.no-results').show();
		}
	};

	return {
		init
	};
})(jQuery, Handlebars, bcpl.utility.querystringer, bcpl.constants);

$(() => {
	bcpl.pageSpecific.search.init();
});
