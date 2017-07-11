'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.flipper = function ($, undefined) {

	var flipperContainerSelector = '.flipper-container';
	var flipperTabSelector = '.flipper-tab';

	var buttonIndex = 0;
	var bookHighlightInterval = void 0;

	var flipperDataError = function flipperDataError(err) {
		console.log('err', err);
	};

	var flipperDataSuccess = function flipperDataSuccess(data) {
		var $flipperContainer = $(flipperContainerSelector);
		var $flipperTabs = $flipperContainer.find(flipperTabSelector);

		$flipperTabs.each(function (index, tab) {
			var $tab = $(tab);
			var tabType = $tab.attr('data-flipper-tab');

			$.each(data, function (index, tabData) {
				if (tabType.toLowerCase() === tabData.type.toLowerCase()) {
					$.each(tabData.books, function (index, book) {
						var html = '<button data-title="' + book.title + '" data-description="' + book.description + '" data-url="' + book.url + '" data-cover-url="' + book.coverUrl + '"><img src="' + book.coverUrl + '" /></button>';
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

	var flipperSetup = function flipperSetup(tabObjects) {
		var $buttons = tabObjects.$flipperTabs.find('button');
		$buttons.on('click', { tabObjects: tabObjects }, bookButtonClicked);

		buttonIndex = highlightButtons(tabObjects, buttonIndex);
		/*
  bookHighlightInterval = setInterval(() => {
  	buttonIndex = highlightButtons(tabObjects, buttonIndex);
  }, 3000);
  */
	};

	var bookButtonClicked = function bookButtonClicked(event) {
		var $button = $(event.currentTarget);
		//clearInterval(bookHighlightInterval);

		buttonIndex = $button.index();
		highlightButtons(event.data.tabObjects, buttonIndex);
	};

	var highlightButtons = function highlightButtons(tabObjects, buttonIndex) {
		var $allButtons = tabObjects.$flipperTabs.find('button');
		var $visibleButtons = tabObjects.$flipperTabs.filter(':visible').find('button');
		var $bookTitle = tabObjects.$flipperContainer.find('.book-title');
		var $bookDescription = tabObjects.$flipperContainer.find('.book-description');
		var $bookUrl = tabObjects.$flipperContainer.find('.book-url');
		var $bookCover = tabObjects.$flipperContainer.find('.book-cover');
		var $chosenButton = $visibleButtons.eq(buttonIndex);

		$allButtons.removeClass('active');
		$chosenButton.addClass('active');

		$bookTitle.text($chosenButton.attr('data-title'));
		$bookDescription.text($chosenButton.attr('data-description'));
		$bookUrl.attr('href', $chosenButton.attr('data-url'));
		$bookCover.attr('src', $chosenButton.attr('data-cover-url'));

		return buttonIndex === $visibleButtons.length - 1 ? 0 : buttonIndex + 1;
	};

	var init = function init() {
		$.getJSON('/mockups/data/homepage-flipper.json').then(flipperDataSuccess, flipperDataError).then(flipperSetup);
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.pageSpecific.homepage.flipper.init();
});