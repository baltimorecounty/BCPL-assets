namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.carousel = (($) => {
	const init = () => {
		$('.hero-wrapper').slick({
			autoplay: true,
			fade: true,
			dots: true,
			arrows: false,
		});
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.pageSpecific.homepage.carousel.init();
});
