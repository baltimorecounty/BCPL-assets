namespacer('bcpl');

bcpl.siteSearch = (($) => {
	const siteSearchBtnSelector = '.search-button';
	const bodyHtmlSelector = 'body, html';
	const scrollSpeed = 250;
	const topScrollPosition = 0;

	const handleSearchBtnClick = (clickEvent) => {
		const $searchBtn = $(clickEvent.target);
		$searchBtn
			.siblings().removeClass('active').end()
			.addClass('active');
	};

	const init = () => {
		$(document).on('click', siteSearchBtnSelector, handleSearchBtnClick);
	};

	return {
		init
	};
})(jQuery);

$(() => bcpl.siteSearch.init());
