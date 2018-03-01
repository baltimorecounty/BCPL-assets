namespacer('bcpl');

bcpl.scrollToTop = (($) => {
	const backToTopButtonSelector = '#scroll-to-top';
	const bodyHtmlSelector = 'body, html';
	const scrollSpeed = 250;
	const topScrollPosition = 0;

	const scrollToTopHandler = () => {
		$(bodyHtmlSelector).animate({
			scrollTop: topScrollPosition
		}, scrollSpeed);
	};

	const windowScrollHandler = () => {
		if (window.pageYOffset === 0) {
			$(backToTopButtonSelector).hide();
		} else {
			$(backToTopButtonSelector).show();
		}
	};

	const init = () => {
		$(document).on('click', backToTopButtonSelector, scrollToTopHandler);
		$(window).on('scroll', _.debounce(windowScrollHandler, 100));
	};

	return {
		init
	};
})(jQuery);

$(() => bcpl.scrollToTop.init());
