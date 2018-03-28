namespacer('bcpl');

bcpl.bookCarousel = (($, constants) => {
	const promises = [];
	const slickSettings = {
		infinite: true,
		arrows: true,
		lazyLoad: 'progressive',
		prevArrow: '<a href="#"><i class="fa fa-chevron-left" aria-hidden="true" /></a>',
		nextArrow: '<a href="#"><i class="fa fa-chevron-right" aria-hidden="true" /></a>',
		slidesToShow: 3,
		responsive: [{
			breakpoint: constants.breakpoints.large,
			settings: {
				slidesToShow: 3
			}
		}, {
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
		const url = constants.shared.urls.bookCarousels.replace('CAROUSEL_ID', carouselId);

		return $.ajax(url, {
			dataType: 'jsonp'
		})
			.then(data => onDataSuccess(data, carouselId));
	};

	const onDataSuccess = (data, carouselId) => {
		const $data = $(data.Carousel_Str);
		const $images = $data.find('li div img');
		const $links = $data.find('li div a');
		const $items = $data
			.find('li')
			.map((index, element) => cleanHtml(index, element, $images, $links));

		$(`.book-carousel[data-carousel-id=${carouselId}]`).append($items.get());
	};

	const cleanHtml = (index, element, $images, $links) => {
		const $image = $images.eq(index);
		const $link = $links.eq(index);
		const $imageLink = $link.clone();

		$image
			.attr('src', $image.attr('src').toLowerCase().replace('sc.gif', 'mc.gif'))
			.attr('style', '');

		$imageLink
			.text('')
			.append($image);

		$link.addClass('media-title');

		return $('<div class="inner"></div>')
			.append($imageLink)
			.append($link);
	};

	const init = (isGrid) => {
		let maxSlides;

		$('.book-carousel').each((index, carouselElement) => {
			const $carouselElement = $(carouselElement);
			const carouselId = $carouselElement.attr('data-carousel-id');
			maxSlides = parseInt($carouselElement.attr('data-max-slides'), 10);

			promises.push(loadData(carouselId));
		});

		if (!isGrid) {
			$.when.apply($, promises).then(() => {
				if (!isNaN(maxSlides) && maxSlides > 0) {
					slickSettings.slidesToShow = maxSlides;
				}

				$('.book-carousel').slick(slickSettings);
			});
		}
	};

	return {
		init
	};
})(jQuery, bcpl.constants);
