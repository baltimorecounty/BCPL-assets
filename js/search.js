namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = (($, window) => {
	const searchButtonClicked = (clickEvent) => {
		const searchTerms = $(clickEvent.target).siblings('input').val();
		window.location = `/dist/search.html?q=${searchTerms}`;
	};

	$(document).on('click', '#search-box button', searchButtonClicked);
})(jQuery, window);
