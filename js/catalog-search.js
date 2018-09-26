namespacer('bcpl');

bcpl.catalogSearch = (($, queryStringer, waitForExistence, constants) => {
	let intervalChecker;
	const catalogSearchSelector = '#catalog-search, .catalog-search';
	const resultsInfoContainerSelector = '.gsc-above-wrapper-area-container';
	const searchCatalogButton = '<td><button id="catalog-search" class="btn btn-primary pull-right">Search the Catalog</button></td>';

	const getCatalogUrl = (searchTerm) => `${constants.baseCatalogUrl}${constants.search.urls.catalog}${searchTerm}`;

	const onCatalogSearchClick = (clickEvent) => {
		clickEvent.preventDefault();

		const queryParams = queryStringer.getAsDictionary();
		const searchTerm = queryParams.search;

		window.location = getCatalogUrl(searchTerm);
	};

	const init = () => {
		waitForExistence(resultsInfoContainerSelector, () => {
			$(resultsInfoContainerSelector).find('td').first().after(searchCatalogButton);
		});
	}

	$(document).on('click', catalogSearchSelector, onCatalogSearchClick);

	$(document).ready(() => {
		init();
	});

	return {
		getCatalogUrl
	};
})(jQuery, bcpl.utility.querystringer, bcpl.utility.waitForExistence, bcpl.constants);
