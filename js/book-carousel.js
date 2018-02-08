namespacer('bcpl');

bcpl.bookCarousel = (($, constants) => {
	const promises = [];
	const slickSettings = {
		infinite: true,
		arrows: true,
		prevArrow: '<a href="#"><i class="fa fa-chevron-left" aria-hidden="true" /></a>',
		nextArrow: '<a href="#"><i class="fa fa-chevron-right" aria-hidden="true" /></a>',
		slidesToShow: 3,
		responsive: [{
			breakpoint: constants.breakpoints.medium,
			settings: {
				slidesToShow: 2
			}
		}, {
			breakpoint: constants.breakpoints.small,
			settings: {
				slidesToShow: 1
			}
		}]
	};

	const loadData = (carouselId) => {
		return $.ajax(constants.shared.urls.bookCarousels.replace('CAROUSEL_ID', carouselId), {
			dataType: 'jsonp'
		}).then(data => {
			const $items = $(data.Carousel_Str)
				.find('li')
				.wrapInner('<div class="inner"></div>')
				.find('[style]')
				.attr('style', '')
				.closest('.inner');

			$(`.book-carousel[data-carousel-id=${carouselId}]`).append($items);
		});
	};

	const init = () => {
		$('.book-carousel').each((index, carouselElement) => {
			const carouselId = $(carouselElement).attr('data-carousel-id');

			promises.push(loadData(carouselId));
		});

		$.when.apply($, promises).then(() => {
			$('.book-carousel').slick(slickSettings);
		});
	};

	return {
		init
	};
})(jQuery, bcpl.constants);
