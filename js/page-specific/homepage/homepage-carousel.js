namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.bookCarousel = (($) => {
	const tabSelector = '.tabs .tab-control';
	const carouselSelector = '.book-carousel';

	const tabControlChangedHandler = () => {
		$(carouselSelector).slick('refresh');
	};

	$(document).on('tabControlChanged', tabSelector, tabControlChangedHandler);
})(jQuery);

