namespacer('bcpl');

bcpl.catalogSearch = (($, queryStringer, constants) => {
	const catalogSearchSelector = '#catalog-search, .catalog-search';

	const getCatalogUrl = (searchTerm) => `${constants.baseCatalogUrl}${constants.search.urls.catalog}${searchTerm}`;

	const onCatalogSearchClick = (clickEvent) => {
		clickEvent.preventDefault();

		const queryParams = queryStringer.getAsDictionary();
		const searchTerm = queryParams.term;

		window.location = getCatalogUrl(searchTerm);
	};

	$(document).on('click', catalogSearchSelector, onCatalogSearchClick);

	return {
		getCatalogUrl
	};
})(jQuery, bcpl.utility.querystringer, bcpl.constants);
