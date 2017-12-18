namespacer('bcpl');

bcpl.scrollToTop = (($) => {
	const backToTopButtonSelector = '#scroll-to-top';

	const scrollToTopHandler = () => {
		$('body, html').animate({ scrollTop: 0 }, 250);
	};

	const init = () => {
		$(document).on('click', backToTopButtonSelector, scrollToTopHandler);
	};

	return {
		init
	};
})(jQuery);

$(() => bcpl.scrollToTop.init());

