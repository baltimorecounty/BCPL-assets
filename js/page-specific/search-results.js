namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = (($, Handlebars, querystringer) => {
	const searchSuccessHandler = (data) => {
		const source = $('#search-results-template').html();
		const template = Handlebars.compile(source);
		const html = template(data);
		$('#search-results').html(html);
	};

	const searchErrorHandler = (err) => {
		console.log(err);
	};

	const init = () => {
		const searchTerms = querystringer.getAsDictionary().q;
		$.get(`http://ba224964:1000/api/polaris/search/${searchTerms}`).then(searchSuccessHandler, searchErrorHandler);
	};

	return {
		init,
	};
})(jQuery, Handlebars, bcpl.utility.querystringer);

$(() => {
	bcpl.pageSpecific.search.init();
});
