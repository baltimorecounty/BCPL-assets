namespacer('bcpl');

bcpl.scrollToTop = (($, window, _) => {
	const backToTopButtonSelector = '#scroll-to-top';
	const bodyHtmlSelector = 'body, html';
	const scrollSpeed = 250;
	const fadingSpeed = 200;
	const topScrollPosition = 0;

	const scrollToTopHandler = () => {
		$(bodyHtmlSelector).animate({
			scrollTop: topScrollPosition
		}, scrollSpeed);
	};

	const windowScrollHandler = () => {
		if (window.pageYOffset === 0) {
			$(backToTopButtonSelector).fadeOut(fadingSpeed);
		} else {
			$(backToTopButtonSelector).fadeIn(fadingSpeed);
		}
	};

	const init = () => {
		$(document).on('click', backToTopButtonSelector, scrollToTopHandler);
		$(window).on('scroll', _.debounce(windowScrollHandler, 100));
	};

	return {
		init
	};
})(jQuery, window, _);

$(() => bcpl.scrollToTop.init());
