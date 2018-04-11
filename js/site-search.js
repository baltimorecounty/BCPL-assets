// Requires jQuery and https://github.com/bassjobsen/Bootstrap-3-Typeahead

namespacer('bcpl');

bcpl.siteSearch = (($, window, constants) => {
	const siteSearchTabSelector = '.search-button';
	const siteSearchInputSelector = '#site-search-input';
	const siteSearchSearchIconSelector = '.site-search-input-container .fa-search';
	const searchButtonCatalogSelector = '.search-button-catalog';
	const searchButtonEventsSelector = '.search-button-events';
	const searchButtonWebsiteSelector = '.search-button-website';
	const searchAction = {};

	const afterTypeAheadSelect = () => {
		searchCatalog(window);
	};

	const clearCatalogSearch = () => {
		$(siteSearchInputSelector)
			.val('')
			.trigger('keyup');
	};

	const disableCatalogAutocomplete = () => {
		$(siteSearchInputSelector).typeahead('destroy');
	};

	const enableCatalogAutoComplete = () => {
		$(siteSearchInputSelector).typeahead({
			source: onTypeAheadSource,
			minLength: 2,
			highlight: true,
			autoSelect: false,
			delay: 100,
			sorter: (results) => results,
			afterSelect: afterTypeAheadSelect
		});
	};

	const focusSiteSearch = (currentTarget) => {
		$(currentTarget).closest('.nav-and-search').find('#site-search-input').focus();
	};

	const getAutocompleteValues = (searchResults) => {
		if (!searchResults) return [];

		return searchResults.map(searchResult => ({
			id: searchResult.Id,
			name: searchResult.Name
		}));
	};

	const getSearchResults = (searchResultsResponse) => searchResultsResponse && Object.prototype.hasOwnProperty.call(searchResultsResponse, 'Results')
		? searchResultsResponse.Results
		: [];

	const getSearchTerms = () => {
		let searchTerms = $(siteSearchInputSelector).val() || '';
		const trimmedSearchTerms = searchTerms.trim();
		const encodedSearchTerms = encodeURIComponent(trimmedSearchTerms);

		return encodedSearchTerms;
	};

	const getSearchUrl = (searchTerm) => `${constants.baseApiUrl}${constants.search.urls.searchTerms}/${searchTerm}`;

	const onSearchCatalogClick = (clickEvent) => {
		focusSiteSearch(clickEvent.currentTarget);
		searchAction.search = () => searchCatalog(window);
		enableCatalogAutoComplete();
	};

	const onSearchEventsClick = (clickEvent) => {
		focusSiteSearch(clickEvent.currentTarget);
		searchAction.search = () => searchEvents(window);
		disableCatalogAutocomplete();
	};

	const onSearchIconClick = () => {
		const searchTerms = getSearchTerms();

		if (searchAction && searchAction.search && searchTerms.length) {
			searchAction.search();
		}
	};

	const onSearchWebsiteClick = (clickEvent) => {
		focusSiteSearch(clickEvent.currentTarget);
		searchAction.search = () => searchWebsite(window);
		disableCatalogAutocomplete();
	};

	const onSiteSearchKeyup = (keyupEvent) => {
		const keyCode = keyupEvent.which || keyupEvent.keyCode;

		if (keyCode === bcpl.constants.keyCodes.enter) {
			const searchTerms = getSearchTerms();

			if (searchAction && searchAction.search && searchTerms.length) {
				searchAction.search(searchTerms);
			}
		}
	};

	const onSearchTabClick = (clickEvent) => {
		const $searchBtn = $(clickEvent.currentTarget)
			.siblings().removeClass('active').end()
			.addClass('active');
		const buttonCaption = $searchBtn.find('i span').text().trim();

		$(siteSearchInputSelector).attr('placeholder', `${buttonCaption}`);
	};

	const onTypeAheadSource = (query, process) => {
		const searchUrl = getSearchUrl(query);

		return $.get(searchUrl, { }, (searchResultsResponse) => {
			const searchResults = getSearchResults(searchResultsResponse);
			const selectData = getAutocompleteValues(searchResults);

			return process(selectData);
		});
	};

	const searchCatalog = (activeWindow, searchTerm) => {
		const searchTerms = searchTerm || getSearchTerms();

		if (searchTerms.length) {
			const baseCatalogUrl = constants.baseCatalogUrl;
			const searchUrl = constants.search.urls.catalog;
			clearCatalogSearch();
			activeWindow.location.href = `${baseCatalogUrl}${searchUrl}${searchTerms}`; // eslint-disable-line 			
		}
	};

	const searchEvents = (activeWindow) => {
		const searchTerms = getSearchTerms();

		if (searchTerms.length) {
			const baseWebsiteUrl = constants.baseWebsiteUrl;
			const searchUrl = constants.search.urls.events;
			activeWindow.location.href = `${baseWebsiteUrl}${searchUrl}${searchTerms}`; // eslint-disable-line 			
		}
	};

	const searchWebsite = (activeWindow) => {
		const searchTerms = getSearchTerms();

		if (searchTerms.length) {
			const baseWebsiteUrl = constants.baseWebsiteUrl;
			const searchUrl = constants.search.urls.website;
			activeWindow.location.href = `${baseWebsiteUrl}${searchUrl}${searchTerms}`; // eslint-disable-line 			
		}
	};

	$(document)
		.on('click', siteSearchTabSelector, onSearchTabClick)
		.on('click', siteSearchSearchIconSelector, onSearchIconClick)
		.on('click', searchButtonCatalogSelector, onSearchCatalogClick)
		.on('keyup', siteSearchInputSelector, onSiteSearchKeyup)
		.on('click', searchButtonEventsSelector, onSearchEventsClick)
		.on('click', searchButtonWebsiteSelector, onSearchWebsiteClick);

	// Initially set up the catalog search
	$(onSearchCatalogClick);

	/* test-code */

	return {
		getSearchTerms,
		searchCatalog
	};

	/* end-test-code */
})(jQuery, window, bcpl.constants);
