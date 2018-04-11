namespacer('bcpl');

bcpl.bookCarousel = (($, constants) => {
	const promises = [];
	const slickSettings = {
		infinite: true,
		arrows: true,
		lazyLoad: 'progressive',
		prevArrow: '<a href="#"><i class="fa fa-chevron-left" aria-hidden="true"><span>Scroll left</span></i></a>',
		nextArrow: '<a href="#"><i class="fa fa-chevron-right" aria-hidden="true"><span>Scroll right</span></i></a>',
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
	let isTitleSearch = false;

	const loadData = (carouselId) => {
		const url = constants.shared.urls.bookCarousels.replace('CAROUSEL_ID', carouselId);

		return $.ajax(url).then(data => onDataSuccess(data, carouselId));
	};

	const textNodeFilter = (index, node) => node.nodeType === 3;

	const authorExtractor = (textNode) =>
		$(textNode)
			.text()
			.split(',')
			.slice(0, 2)
			.join(',');

	const onDataSuccess = (data, carouselId) => {
		const $data = $(data.Carousel_Str);
		const $items = $data
			.find('li')
			.map((index, element) => cleanHtml(index, element));

		$(`.book-carousel[data-carousel-id=${carouselId}]`).append($items.get());
	};

	const cleanHtml = (index, listItem) => {
		const $listItem = $(listItem);
		const $image = $listItem.find('img');
		const $link = $listItem.find('a');
		const imageTitle = $image.attr('title');
		const $titleDisplay = $(`<p>${imageTitle}</p>`);
		const title = encodeURIComponent(imageTitle.split(':')[0]);

		$image
			.attr('src', $image.attr('src').toLowerCase().replace('sc.gif', 'mc.gif'))
			.attr('style', '')
			.attr('title', '')
			.attr('alt', `${$image.attr('alt')} - book cover`);

		$link
			.text('')
			.append($image)
			.append($titleDisplay);

		if (isTitleSearch) {
			const author = authorExtractor($listItem
				.find('div')
				.eq(1)
				.contents()
				.filter(textNodeFilter));

			const newLinkHref = `${constants.baseCatalogUrl}/polaris/search/searchresults.aspx?ctx=1.1033.0.0.5&type=Boolean&term=AU=%22${author}%22%20AND%20TI=%22${title}%22&by=KW&sort=MP&limit=&query=&page=0`;

			$link.attr('href', newLinkHref);
		}

		return $('<div class="inner"></div>')
			.append($link);
	};

	const init = (settings) => {
		const $carousels = $('.book-carousel');

		if (settings) {
			if (settings.isTitleSearch) {
				isTitleSearch = settings.isTitleSearch;
			}

			if (settings.isGrid) {
				$carousels.addClass('grid');
			}
		}

		$carousels.each((index, carouselElement) => {
			const $carouselElement = $(carouselElement);
			const carouselId = $carouselElement.attr('data-carousel-id');

			promises.push(loadData(carouselId));
		});

		if (!settings || !settings.isGrid) {
			$.when.apply($, promises).then(() => {
				if (settings && settings.maxSlides > 0) {
					slickSettings.slidesToShow = settings.maxSlides;
				}

				$carousels.slick(slickSettings);
			});
		}
	};

	return {
		init
	};
})(jQuery, bcpl.constants);
