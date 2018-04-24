'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.swiftypeSearchResults = function ($, querystringer, Handlebars, constants) {
	var $searchResultsTarget = void 0;
	var searchResultsTargetSelector = '#search-results-target';
	var templateSelector = '#swiftype-search-results-template';
	var errorMessageHtml = '<div class="main-content top-border"><p>There were no results found for this search.</p></div>';

	var cleanSearchTerm = function cleanSearchTerm(termToClean) {
		var cleanedSearchTerm = termToClean.trim();
		var safeSearchTerms = [];
		// Ensure the last character is not '+' as the the trailing space causes no results
		if (cleanedSearchTerm[cleanedSearchTerm.length - 1] === '+') {
			cleanedSearchTerm = cleanedSearchTerm.slice(0, -1);
		}

		var searchTerms = cleanedSearchTerm.split('+');
		for (var i = 0, len = searchTerms.length; i < len; i += 1) {
			var term = decodeURIComponent(searchTerms[i]);
			term = term.replace(/[?#\\/]/g, ' ').replace(/&/g, 'and').trim();

			var encodedTerm = encodeURIComponent(term);
			safeSearchTerms.push(encodedTerm);
		}
		return safeSearchTerms.join('%20');
	};

	var getSearchResults = function getSearchResults(searchTerm, pageNumber, filter) {
		var currentPageNumber = pageNumber || 1;
		var cleanedSearchTerm = cleanSearchTerm(searchTerm);
		var filterString = filter && filter.length > 0 ? filter : 'none';
		var requestUrl = '' + constants.baseApiUrl + constants.search.urls.api + '/' + cleanedSearchTerm + '/' + currentPageNumber + '?filterType=' + filterString;

		$.ajax(requestUrl).then(searchResultRequestSuccessHandler, searchResultRequestErrorHandler);
	};

	var postClickThroughData = function postClickThroughData(searchTerm, id, destinationUrl) {
		var cleanedSearchTerm = cleanSearchTerm(searchTerm);
		var requestUrl = '' + constants.baseApiUrl + constants.search.urls.trackClickThrough + '/' + cleanedSearchTerm + '/' + id;

		$.ajax({
			type: 'POST',
			url: requestUrl
		}).then(function () {
			return postClickThroughSuccess(destinationUrl);
		}, searchResultRequestErrorHandler);
	};

	var postClickThroughSuccess = function postClickThroughSuccess(destinationUrl) {
		window.location = destinationUrl;
	};

	var searchResultRequestErrorHandler = function searchResultRequestErrorHandler(err) {
		console.error(err); // eslint-disable-line no-console
	};

	var buildResultSettings = function buildResultSettings(result) {
		var highlight = result.highlight.body || result.highlight.sections || result.highlight.title;
		var title = result.title;
		var url = result.url;
		var id = result.id;

		return {
			highlight: highlight,
			title: title,
			url: url,
			id: id
		};
	};

	var buildSearchResults = function buildSearchResults(hits) {
		return hits.map(function (hit) {
			return buildResultSettings(hit);
		});
	};

	var buildPageLinks = function buildPageLinks(lastPage, currentPage) {
		var pageLinks = [];

		for (var i = 1; i <= lastPage; i += 1) {
			pageLinks.push({
				page: i,
				current: i === currentPage
			});
		}

		return pageLinks;
	};

	var calculateLastResultNumber = function calculateLastResultNumber(info) {
		return info.current_page * info.per_page < info.total_result_count ? info.current_page * info.per_page : info.total_result_count;
	};

	var calculateFirstResultNumber = function calculateFirstResultNumber(info) {
		return (info.current_page - 1) * info.per_page + 1;
	};

	var buildSearchResultsHtml = function buildSearchResultsHtml(templateSettings) {
		var source = $(templateSelector).html();
		var template = Handlebars.compile(source, { noEscape: true });
		var searchResultsHtml = template(templateSettings);

		return searchResultsHtml;
	};

	var searchResultRequestSuccessHandler = function searchResultRequestSuccessHandler(response) {
		var info = response.info.page;
		var hits = response.records.page;
		var query = info.query;
		var maxPages = 10;
		var tooManyResults = info.num_pages > maxPages;
		var lastPage = tooManyResults ? maxPages : info.num_pages;
		var lastResultNumber = calculateLastResultNumber(info);
		var firstResultNumber = calculateFirstResultNumber(info);
		var spellingSuggestion = info.spelling_suggestion ? info.spelling_suggestion.text : undefined;
		var searchResult = buildSearchResults(hits);
		var pageLinks = buildPageLinks(lastPage, info.current_page);

		info.base_url = window.location.pathname + '?term=' + info.query + '&page=';

		info.index = {
			first: firstResultNumber,
			last: lastResultNumber
		};

		var templateSettings = {
			searchResult: searchResult,
			info: info,
			pageLinks: pageLinks,
			tooManyResults: tooManyResults,
			spellingSuggestion: spellingSuggestion,
			query: query
		};

		var searchResultsHtml = buildSearchResultsHtml(templateSettings);

		$searchResultsTarget.html(searchResultsHtml);
		$searchResultsTarget.find('.loading').hide().end().find('.search-results-display').show();
	};

	var init = function init() {
		var queryStringDictionary = querystringer.getAsDictionary();

		$searchResultsTarget = $(searchResultsTargetSelector);

		if (queryStringDictionary.term) {
			getSearchResults(queryStringDictionary.term, queryStringDictionary.page, queryStringDictionary.filter);
		} else {
			$searchResultsTarget.html(errorMessageHtml);
		}
	};

	var trackClickThrough = function trackClickThrough(clickEvent) {
		var $target = $(clickEvent.currentTarget);
		var searchTerm = window.location.search.replace('?term=', '');
		var id = $target.attr('data-id');
		var destinationUrl = $target.attr('href');

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
}(jQuery, bcpl.utility.querystringer, Handlebars, bcpl.constants);

$(function () {
	$(document).on('click', '.search-results-display a', bcpl.pageSpecific.swiftypeSearchResults.trackClickThrough);

	bcpl.pageSpecific.swiftypeSearchResults.init();
});