namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.swiftypeSearchResults = (($, querystringer, Handlebars, constants) => {
	let $searchResultsTarget;
	const searchResultsTargetSelector = '#search-results-target';
	const templateSelector = '#swiftype-search-results-template';
	const errorMessageHtml = '<div class="main-content top-border"><p>There were no results found for this search.</p></div>';

	const cleanSearchTerm = (termToClean) => {
		let cleanedSearchTerm = termToClean.trim();
		const safeSearchTerms = [];
		// Ensure the last character is not '+' as the the trailing space causes no results
		if (cleanedSearchTerm[cleanedSearchTerm.length - 1] === '+') {
			cleanedSearchTerm = cleanedSearchTerm.slice(0, -1);
		}

		const searchTerms = cleanedSearchTerm.split('+');
		for (let i = 0, len = searchTerms.length; i < len; i += 1) {
			let term = decodeURIComponent(searchTerms[i]);
			term = term
				.replace(/[?#\\/]/g, ' ')
				.replace(/&/g, 'and').trim();

			const encodedTerm = encodeURIComponent(term);
			safeSearchTerms.push(encodedTerm);
		}
		return safeSearchTerms.join('%20');
	};

	const getSearchResults = (searchTerm, pageNumber) => {
		const currentPageNumber = pageNumber || 1;
		const cleanedSearchTerm = cleanSearchTerm(searchTerm);
		const requestUrl = `${constants.baseApiUrl}${constants.search.urls.api}/${cleanedSearchTerm}/${currentPageNumber}`;

		$.ajax(requestUrl)
			.then(searchResultRequestSuccessHandler, searchResultRequestErrorHandler);
	};

	const postClickThroughData = (searchTerm, id, destinationUrl) => {
		const cleanedSearchTerm = cleanSearchTerm(searchTerm);
		const requestUrl = `${constants.baseApiUrl}${constants.search.urls.trackClickThrough}/${cleanedSearchTerm}/${id}`;

		$.ajax({
			type: 'POST',
			url: requestUrl
		})
			.then(() => postClickThroughSuccess(destinationUrl), searchResultRequestErrorHandler);
	};

	const postClickThroughSuccess = (destinationUrl) => {
		window.location = destinationUrl;
	};

	const searchResultRequestErrorHandler = (err) => {
		console.error(err); // eslint-disable-line no-console
	};

	const buildResultSettings = (result) => {
		const highlight = result.highlight.body || result.highlight.sections || result.highlight.title;
		const title = result.title;
		const url = result.url;
		const id = result.id;

		return {
			highlight,
			title: title,
			url: url,
			id: id
		};
	};

	const buildSearchResults = (hits) => {
		const results = [];

		for (let i = 0, hitCount = hits.length; i < hitCount; i += 1) {
			results.push(buildResultSettings(hits[i]));
		}

		return results;
	};

	const buildPageLinks = (lastPage, currentPage) => {
		const pageLinks = [];

		for (let i = 1; i <= lastPage; i += 1) {
			pageLinks.push({
				page: i,
				current: i === currentPage
			});
		}

		return pageLinks;
	};

	const calculateLastResultNumber = (info) => {
		return info.current_page * info.per_page < info.total_result_count ?
			info.current_page * info.per_page :
			info.total_result_count;
	};

	const calculateFirstResultNumber = (info) => {
		return ((info.current_page - 1) * info.per_page) + 1;
	};

	const buildSearchResultsHtml = (templateSettings) => {
		const source = $(templateSelector).html();
		const template = Handlebars.compile(source, { noEscape: true });
		const searchResultsHtml = template(templateSettings);

		return searchResultsHtml;
	};

	const searchResultRequestSuccessHandler = (response) => {
		const info = response.info.page;
		const hits = response.records.page;
		const query = info.query;
		const maxPages = 10;
		const tooManyResults = info.num_pages > maxPages;
		const lastPage = tooManyResults ? maxPages : info.num_pages;
		const lastResultNumber = calculateLastResultNumber(info);
		const firstResultNumber = calculateFirstResultNumber(info);
		const spellingSuggestion = info.spelling_suggestion ? info.spelling_suggestion.text : undefined;
		const searchResults = buildSearchResults(hits);
		const pageLinks = buildPageLinks(lastPage, info.current_page);

		info.base_url = window.location.pathname + '?term=' + info.query + '&page=';

		info.index = {
			first: firstResultNumber,
			last: lastResultNumber
		};

		const templateSettings = {
			searchResult: searchResults,
			info: info,
			pageLinks: pageLinks,
			tooManyResults: tooManyResults,
			spellingSuggestion: spellingSuggestion,
			query: query
		};

		const searchResultsHtml = buildSearchResultsHtml(templateSettings);

		$searchResultsTarget.html(searchResultsHtml);
		$searchResultsTarget.find('.loading').hide();
		$searchResultsTarget.find('.search-results-display').show();
	};

	const init = () => {
		const queryStringDictionary = querystringer.getAsDictionary();

		$searchResultsTarget = $(searchResultsTargetSelector);

		if (queryStringDictionary.term) {
			getSearchResults(queryStringDictionary.term, queryStringDictionary.page);
		} else {
			$searchResultsTarget.html(errorMessageHtml);
		}
	};

	const trackClickThrough = (clickEvent) => {
		const $target = $(clickEvent.currentTarget);
		const searchTerm = window.location.search.replace('?term=', '');
		const id = $target.attr('data-id');
		const destinationUrl = $target.attr('href');

		postClickThroughData(searchTerm, id, destinationUrl);
	};


	return {
		/* test-code */
		calculateLastResultNumber: calculateLastResultNumber,
		calculateFirstResultNumber: calculateFirstResultNumber,
		buildPageLinks: buildPageLinks,
		/* end-test-code */
		init: init,
		trackClickThrough: trackClickThrough
	};
})(jQuery, bcpl.utility.querystringer, Handlebars, bcpl.constants);

$(() => {
	$(document).on('click', '.search-results-display a', bcpl.pageSpecific.swiftypeSearchResults.trackClickThrough);

	bcpl.pageSpecific.swiftypeSearchResults.init();
});
