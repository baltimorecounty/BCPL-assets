'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = function ($, Handlebars, querystringer) {
	var searchSuccessHandler = function searchSuccessHandler(data) {
		var source = $('#search-results-template').html();
		var template = Handlebars.compile(source);
		var html = template(data);
		$('#search-results').html(html);
	};

	var searchErrorHandler = function searchErrorHandler(err) {
		console.log(err);
	};

	var init = function init() {
		var searchTerms = querystringer.getAsDictionary().q;
		$.get('http://ba224964:1000/api/polaris/search/' + searchTerms).then(searchSuccessHandler, searchErrorHandler);
	};

	return {
		init: init
	};
}(jQuery, Handlebars, bcpl.utility.querystringer);

$(function () {
	bcpl.pageSpecific.search.init();
});