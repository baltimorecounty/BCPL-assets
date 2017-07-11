namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.flipper = (($, undefined) => {

	const flipperContainerSelector = '.flipper-container';
	const flipperTabSelector = '.flipper-tab';

	let buttonIndex = 0;
	let bookHighlightInterval;

	const flipperDataError = err => {
		console.log('err', err);
	};

	const flipperDataSuccess = data => {
		const $flipperContainer = $(flipperContainerSelector);
		const $flipperTabs = $flipperContainer.find(flipperTabSelector);

		$flipperTabs.each((index, tab) => {
			const $tab = $(tab);
			const tabType = $tab.attr('data-flipper-tab');

			$.each(data, (index, tabData) => {
				if (tabType.toLowerCase() === tabData.type.toLowerCase()) {
					$.each(tabData.books, (index, book) => {
						const html = `<button data-title="${book.title}" data-description="${book.description}" data-url="${book.url}" data-cover-url="${book.coverUrl}"><img src="${book.coverUrl}" /></button>`;
						$tab.append(html);
					});
				}
			});
		});

		return {
			$flipperContainer: $flipperContainer,
			$flipperTabs: $flipperTabs
		};
	};

	const flipperSetup = tabObjects => {	
		const $buttons = tabObjects.$flipperTabs.find('button');
		$buttons.on('click', { tabObjects: tabObjects }, bookButtonClicked);		

		buttonIndex = highlightButtons(tabObjects, buttonIndex);
		/*
		bookHighlightInterval = setInterval(() => {
			buttonIndex = highlightButtons(tabObjects, buttonIndex);
		}, 3000);
		*/
	};

	const bookButtonClicked = event => {
		const $button = $(event.currentTarget);
		//clearInterval(bookHighlightInterval);

		buttonIndex = $button.index();
		highlightButtons(event.data.tabObjects, buttonIndex);
	};

	const highlightButtons = (tabObjects, buttonIndex) => {
		const $allButtons = tabObjects.$flipperTabs.find('button');
		const $visibleButtons = tabObjects.$flipperTabs.filter(':visible').find('button');
		const $bookTitle = tabObjects.$flipperContainer.find('.book-title');
		const $bookDescription = tabObjects.$flipperContainer.find('.book-description');
		const $bookUrl = tabObjects.$flipperContainer.find('.book-url');	
		const $bookCover = tabObjects.$flipperContainer.find('.book-cover');	
		const $chosenButton = $visibleButtons.eq(buttonIndex);

		$allButtons.removeClass('active');
		$chosenButton.addClass('active');

		$bookTitle.text($chosenButton.attr('data-title'));
		$bookDescription.text($chosenButton.attr('data-description'));
		$bookUrl.attr('href', $chosenButton.attr('data-url'));
		$bookCover.attr('src',$chosenButton.attr('data-cover-url'));

		return buttonIndex === $buttons.length - 1 ? 0 : buttonIndex + 1;
	};

	const init = () => {
		$.getJSON('/mockups/data/homepage-flipper.json')
			.then(flipperDataSuccess, flipperDataError)
			.then(flipperSetup);		
	};

	return { init };

})(jQuery);

$(() => {
	bcpl.pageSpecific.homepage.flipper.init();
});