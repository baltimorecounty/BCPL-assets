'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = function ($, Handlebars, querystringer) {
	var getMaterialTypeData = function getMaterialTypeData(processMaterialTypeCallback) {
		$.ajax('http://ba224964:3000/data/primaryMaterialType.json').then(function (json) {
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

		templateData.ResultsPerPageButtons = [{ count: 10, isCurrent: data.ResultsPerPage === 10 }, { count: 25, isCurrent: data.ResultsPerPage === 25 }, { count: 50, isCurrent: data.ResultsPerPage === 50 }, { count: 100, isCurrent: data.ResultsPerPage === 100 }];

		templateData.PageNumbers = getPageNumbers(templateData.CurrentPage, templateData.Pages);

		getMaterialTypeData(function (materialTypes) {
			_.map(templateData.SearchResults, function (record) {
				record.icon = materialTypes[_.findIndex(materialTypes, {
					id: parseInt(record.PrimaryTypeOfMaterial, 10)
				})].icon;
			});

			var source = $('#search-results-template').html();
			var template = Handlebars.compile(source);
			var html = template(templateData);
			$('#search-results').html(html);
		});
	};

	var searchErrorHandler = function searchErrorHandler(err) {
		console.log(err);
	};

	var resultCountButtonClicked = function resultCountButtonClicked(event) {
		var $button = $(event.currentTarget);
		var selectedResultsPerPage = $button.attr('data-results-per-page');

		window.location = window.location.pathname + '?q=' + event.data.searchTerm + '&page=' + event.data.pageNumber + '&resultsPerPage=' + selectedResultsPerPage;
	};

	var pageButtonClicked = function pageButtonClicked(event) {
		var $button = $(event.currentTarget);
		var selectedPageNumber = $button.attr('data-page-number');

		window.location = window.location.pathname + '?q=' + event.data.searchTerm + '&page=' + selectedPageNumber + '&resultsPerPage=' + event.data.resultsPerPage;
	};

	var init = function init() {
		var querystring = querystringer.getAsDictionary();
		var searchTerm = querystring.q.trim();
		var pageNumber = querystring.page ? querystring.page : 1;
		var resultsPerPage = querystring.resultsperpage ? querystring.resultsperpage : 10;

		$(document).on('click', '#pager .results-per-page button', { searchTerm: searchTerm, pageNumber: pageNumber, resultsPerPage: resultsPerPage }, resultCountButtonClicked);
		$(document).on('click', '#pager .page-numbers button', { searchTerm: searchTerm, pageNumber: pageNumber, resultsPerPage: resultsPerPage }, pageButtonClicked);

		if (searchTerm) {
			$.get('http://ba224964:1000/api/polaris/search/' + searchTerm + '/' + pageNumber + '/' + resultsPerPage).then(searchSuccessHandler, searchErrorHandler);
		}
	};

	return {
		init: init
	};
}(jQuery, Handlebars, bcpl.utility.querystringer);

$(function () {
	bcpl.pageSpecific.search.init();
});