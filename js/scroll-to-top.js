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

	const init = () => {
		$(document).on('click', backToTopButtonSelector, scrollToTopHandler);
	};

	return {
		init
	};
})(jQuery);

$(() => bcpl.scrollToTop.init());