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

	var searchSuccessHandler = function searchSuccessHandler(data) {
		getMaterialTypeData(function (materialTypes) {
			_.map(data, function (record) {
				record.icon = materialTypes[_.findIndex(materialTypes, {
					id: parseInt(record.PrimaryTypeOfMaterial, 10)
				})].icon;
			});

			var source = $('#search-results-template').html();
			var template = Handlebars.compile(source);
			var html = template(data);
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
		var searchTerm = querystring.q;
		var pageNumber = querystring.page;
		var resultsPerPage = querystring.resultsperpage;

		$(document).on('click', '#pager .results-per-page button', { searchTerm: searchTerm, pageNumber: pageNumber, resultsPerPage: resultsPerPage }, resultCountButtonClicked);
		$(document).on('click', '#pager .page-numbers button', { searchTerm: searchTerm, pageNumber: pageNumber, resultsPerPage: resultsPerPage }, pageButtonClicked);

		$.get('http://ba224964:1000/api/polaris/search/' + searchTerm).then(searchSuccessHandler, searchErrorHandler);
	};

	return {
		init: init
	};
}(jQuery, Handlebars, bcpl.utility.querystringer);

$(function () {
	bcpl.pageSpecific.search.init();
});