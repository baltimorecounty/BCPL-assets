namespacer('bcpl');

bcpl.catalogSearch = (($, queryStringer, waitForExistence, constants) => {
	const catalogSearchSelector = '#catalog-search, .catalog-search';
	const resultsInfoContainerSelector = '.gsc-above-wrapper-area-container';
	const searchCatalogButton = '<td><button id="catalog-search" class="btn btn-primary pull-right">Search the Catalog</button></td>';
	const showResults = "#resInfo-0:contains('About')";
	const getCatalogUrl = (searchTerm) => `${constants.baseCatalogUrl}${constants.search.urls.catalog}${searchTerm}`;

	const getSearchTerm = () =>{
		const queryParams = queryStringer.getAsDictionary();
		return queryParams.term;
	};

	const onCatalogSearchClick = (clickEvent) => {
		clickEvent.preventDefault();
		window.location = getCatalogUrl(getSearchTerm());
	};

	const init = () => {
		waitForExistence(showResults, () => {
			$(showResults).prepend(`Showing results for ${getSearchTerm()} <br>`);
			$(resultsInfoContainerSelector).find('td').first().after(searchCatalogButton);
		});
	};

	$(document).on('click', catalogSearchSelector, onCatalogSearchClick);

	$(document).ready(() => {
		init();
	});

	return {
		getCatalogUrl
	};
})(jQuery, bcpl.utility.querystringer, bcpl.utility.waitForExistence, bcpl.constants);
