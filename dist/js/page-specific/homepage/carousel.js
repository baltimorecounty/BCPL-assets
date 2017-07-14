'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.carousel = function ($, undefined) {

	var init = function init() {
		$('.hero-wrapper').slick({
			autoplay: true,
			fade: true,
			dots: true,
			arrows: false
		});
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.pageSpecific.homepage.carousel.init();
});