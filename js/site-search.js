namespacer('bcpl');

bcpl.siteSearch = (($, window, constants) => {
	const siteSearchTabSelector = '.search-button';
	const siteSearchInputSelector = '#site-search-input';
	const siteSearchSearchIconSelector = '.site-search-input-container .fa-search';
	const searchButtonCatalogSelector = '.search-button-catalog';
	const searchButtonEventsSelector = '.search-button-events';
	const searchButtonWebsiteSelector = '.search-button-website';
	const searchAction = {};

	const onSearchTabClick = (clickEvent) => {
		const $searchBtn = $(clickEvent.currentTarget);
		const buttonCaption = $searchBtn
			.siblings().removeClass('active').end()
			.addClass('active')
			.text()
			.trim();

		$(siteSearchInputSelector).attr('placeholder', `Search the ${buttonCaption}`);
	};

	const onSearchCatalogClick = () => {
		searchAction.search = () => searchCatalog(window);
	};

	const onSearchEventsClick = () => {
		searchAction.search = () => searchEvents(window);
	};

	const onSearchWebsiteClick = () => {
		searchAction.search = () => searchWebsite(window);
	};

	const onSearchIconClick = () => {
		const searchTerms = getSearchTerms();

		if (searchAction && searchAction.search && searchTerms.length) {
			searchAction.search();
		}
	};

	const onSiteSearchKeyup = (keyupEvent) => {
		const keyCode = keyupEvent.which || keyupEvent.keyCode;

		if (keyCode === bcpl.constants.keyCodes.enter) {
			const searchTerms = getSearchTerms();

			if (searchAction && searchAction.search && searchTerms.length) {
				searchAction.search();
			}
		}
	};

	const searchCatalog = (activeWindow) => {
		const searchTerms = getSearchTerms();

		if (searchTerms.length) {
			const baseCatalogUrl = constants.baseCatalogUrl;
			const searchUrl = constants.search.urls.catalog;
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

	const getSearchTerms = () => {
		const $searchBox = $(siteSearchInputSelector);
		const searchTerms = $searchBox.val() || '';
		const trimmedSearchTerms = searchTerms.trim();
		const encodedSearchTerms = encodeURIComponent(trimmedSearchTerms);

		return encodedSearchTerms;
	};

	$(document).on('click', siteSearchTabSelector, onSearchTabClick);
	$(document).on('click', siteSearchSearchIconSelector, onSearchIconClick);
	$(document).on('click', searchButtonCatalogSelector, onSearchCatalogClick);
	$(document).on('keyup', siteSearchInputSelector, onSiteSearchKeyup);
	$(document).on('click', searchButtonEventsSelector, onSearchEventsClick);
	$(document).on('click', searchButtonWebsiteSelector, onSearchWebsiteClick);

	// Initially set up the catalog search
	$(onSearchCatalogClick);

	/* test-code */

	return {
		getSearchTerms,
		searchCatalog
	};

	/* end-test-code */
})(jQuery, window, bcpl.constants);
