namespacer('bcpl');

bcpl.bookCarousel = (($, constants) => {
	const promises = [];
	const slickSettings = {
		infinite: true,
		arrows: true,
		prevArrow: '<a href="#"><i class="fa fa-chevron-left" aria-hidden="true" /></a>',
		nextArrow: '<a href="#"><i class="fa fa-chevron-right" aria-hidden="true" /></a>',
		slidesToShow: 4,
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

		$image
			.attr('src', $image.attr('src').toLowerCase().replace('sc.gif', 'mc.gif'))
			.attr('style', '');

		return $('<div class="inner"></div>')
			.append($image)
			.append($link);
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
