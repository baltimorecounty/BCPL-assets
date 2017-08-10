'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = function ($, Handlebars, querystringer) {
	var getMaterialTypeData = function getMaterialTypeData(processMaterialTypeCallback) {
		$.ajax(bcpl.constants.baseApiUrl + '/data/primaryMaterialType.json').then(function (json) {
			return processMaterialTypeCallback(json);
		}, function (err) {
			return console.log(err);
		});
	};

	var buildArrayFromRange = function buildArrayFromRange(start, end, current) {
		return Array.from({ length: end - start + 1 }, function (value, key) {
			return { page: key + start, isCurrent: key + start === current };
		});
	};

	var getPageNumbers = function getPageNumbers(current, max) {
		if (max <= 1 || max < current) return 1;

		var difference = max - current;

		if (current <= 3 && max <= 5) return buildArrayFromRange(1, max, current);

		if (current <= 3 && max >= 5) return buildArrayFromRange(1, 5, current);

		if (difference >= 2) return buildArrayFromRange(current - 2, current + 2, current);

		if (max <= 5) return buildArrayFromRange(1, max, current);

		return buildArrayFromRange(max - 4, max, current);
	};

	var searchSuccessHandler = function searchSuccessHandler(data) {
		var templateData = data;

		if (templateData.SearchResults.length > 0) {
			templateData.ResultsPerPageButtons = [{ count: 10, isCurrent: data.ResultsPerPage === 10 }, { count: 25, isCurrent: data.ResultsPerPage === 25 }, { count: 50, isCurrent: data.ResultsPerPage === 50 }, { count: 100, isCurrent: data.ResultsPerPage === 100 }];

			templateData.PageNumbers = getPageNumbers(templateData.CurrentPage, templateData.Pages);

			getMaterialTypeData(function (materialTypes) {
				var recordsWithIcons = [];
				_.map(templateData.SearchResults, function (record) {
					var recordWithIcon = {};
					recordWithIcon.icon = materialTypes[_.findIndex(materialTypes, {
						id: parseInt(record.PrimaryTypeOfMaterial, 10)
					})].icon;
					recordsWithIcons.push(recordWithIcon);
				});

				templateData.SearchResults = recordsWithIcons;

				var source = $('#search-results-template').html();
				var template = Handlebars.compile(source);
				var html = template(templateData);
				$('.loading').hide();
				$('#search-results').html(html);
			});
		} else {
			$('.no-results').show();
		}
	};

	var searchErrorHandler = function searchErrorHandler(err) {
		console.log(err);
	};

	var loadSearchPage = function loadSearchPage(searchTerm, pageNumber, selectedResultsPerPage) {
		window.location = window.location.pathname + '?q=' + searchTerm + '&page=' + pageNumber + '&resultsPerPage=' + selectedResultsPerPage;
	};

	var resultCountButtonClicked = function resultCountButtonClicked(event) {
		var $button = $(event.currentTarget);
		var selectedResultsPerPage = $button.attr('data-results-per-page');

		loadSearchPage(event.data.searchTerm, event.data.pageNumber, selectedResultsPerPage);
	};

	var pageButtonClicked = function pageButtonClicked(event) {
		var $button = $(event.currentTarget);
		var selectedPageNumber = $button.attr('data-page-number');

		loadSearchPage(event.data.searchTerm, selectedPageNumber, event.data.selectedResultsPerPage);
	};

	var init = function init() {
		var querystring = querystringer.getAsDictionary();

		if (querystring.q) {
			var searchTerm = querystring.q.trim();
			var pageNumber = querystring.page ? querystring.page : 1;
			var resultsPerPage = querystring.resultsperpage ? querystring.resultsperpage : 10;

			$(document).on('click', '#pager .results-per-page button', { searchTerm: searchTerm, pageNumber: pageNumber, resultsPerPage: resultsPerPage }, resultCountButtonClicked);
			$(document).on('click', '#pager .page-numbers button', { searchTerm: searchTerm, pageNumber: pageNumber, resultsPerPage: resultsPerPage }, pageButtonClicked);

			$.get(bcpl.constants.baseApiUrl + '/api/polaris/search/' + searchTerm + '/' + pageNumber + '/' + resultsPerPage).then(searchSuccessHandler, searchErrorHandler);
		} else {
			$('.loading').hide();
			$('.no-results').show();
		}
	};

	return {
		init: init
	};
}(jQuery, Handlebars, bcpl.utility.querystringer);

$(function () {
	bcpl.pageSpecific.search.init();
});