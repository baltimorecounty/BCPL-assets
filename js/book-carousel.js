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
	let isTitleSearch = false;

	const loadData = (carouselId) => {
		const url = constants.shared.urls.bookCarousels.replace('CAROUSEL_ID', carouselId);

		return $.ajax(url, {
			dataType: 'jsonp'
		})
			.then(data => onDataSuccess(data, carouselId));
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
		const $imageLink = $link.clone();
		const titleRemoveString = ' : a novel';

		$image
			.attr('src', $image.attr('src').toLowerCase().replace('sc.gif', 'mc.gif'))
			.attr('style', '');

		$imageLink
			.text('')
			.append($image);

		$link.addClass('media-title');

		if (isTitleSearch) {
			const author = authorExtractor($listItem
				.find('div')
				.eq(1)
				.contents()
				.filter(textNodeFilter));
			const title = encodeURIComponent($image.attr('title').replace(titleRemoveString, ''));
			// const linkHref = `${constants.baseCatalogUrl}/polaris/search/searchresults.aspx?ctx=1.1033.0.0.5&type=Advanced&term=${title}&relation=ALL&by=TI&term2=${author}&relation2=ALL&by2=AU&bool1=AND&bool4=AND&limit=TOM=*&sort=MP&page=0`;
			// the link below is temporary
			const linkHref = `https://catalog.bcpl.lib.md.us/polaris/search/searchresults.aspx?ctx=1.1033.0.0.5&type=Advanced&term=${title}&relation=ALL&by=TI&term2=${author}&relation2=ALL&by2=AU&bool1=AND&bool4=AND&limit=TOM=*&sort=MP&page=0`;

			$imageLink.attr('href', linkHref);
			$link.attr('href', linkHref);
		}

		return $('<div class="inner"></div>')
			.append($imageLink)
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
