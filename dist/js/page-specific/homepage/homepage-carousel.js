'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.carousel = function ($) {
	var tabSelector = '.tabs .tab-control';
	var carouselSelector = '.book-carousel';

	var tabControlChangedHandler = function tabControlChangedHandler() {
		$(carouselSelector).slick('refresh');
	};

	$(document).on('tabControlChanged', tabSelector, tabControlChangedHandler);
}(jQuery);