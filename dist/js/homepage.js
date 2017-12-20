'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.carousel = function ($) {
	var init = function init() {
		$('.hero-wrapper').slick({
			autoplay: true,
			fade: true,
			dots: true,
			arrows: false,
			adaptiveHeight: true
		});
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.pageSpecific.homepage.carousel.init();
});
'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.events = function ($, Handlebars, moment, CONSTANTS) {
	var activatePost = function activatePost(event) {
		var $target = $(event.currentTarget);
		var $animationTarget = $target.find('.animated');

		$animationTarget.addClass('active');
	};

	var deactivatePost = function deactivatePost(event) {
		var $target = $(event.currentTarget);
		var $animationTarget = $target.find('.animated');

		$animationTarget.removeClass('active');
	};

	var formatTime = function formatTime(unformattedTime) {
		return unformattedTime.replace(':00', '').replace(/\w\w$/, function (foundString) {
			return foundString.split('').join('.') + '.';
		});
	};

	var processEvent = function processEvent(calendarEvent) {
		var localCalendarEvent = calendarEvent;
		var eventMoment = moment(calendarEvent.EventStart);

		localCalendarEvent.eventMonth = eventMoment.format('MMM');
		localCalendarEvent.eventDate = eventMoment.format('D');
		localCalendarEvent.eventTime = formatTime(eventMoment.format('h:mm a'));
		localCalendarEvent.requiresRegistration = localCalendarEvent.RegistrationTypeCodeEnum !== 0;

		return localCalendarEvent;
	};

	var eventsDataLoadedHandler = function eventsDataLoadedHandler(eventsResponse) {
		if (eventsResponse.Events.length) {
			var eventsWithDateAndMonth = eventsResponse.Events.map(processEvent);

			var sourceHtml = $('#events-template').html();
			var template = Handlebars.compile(sourceHtml);
			var html = template(eventsWithDateAndMonth);

			$('#events-target').html(html);
		}
	};

	$.ajax(CONSTANTS.homepage.urls.events).done(eventsDataLoadedHandler);

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);

	return {
	};
}(jQuery, Handlebars, moment, bcpl.constants);
'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.flipper = function ($, CONSTANTS) {
	var flipperContainerSelector = '.flipper-container';
	var flipperTabSelector = '.flipper-tab';

	var buttonIndex = 0;

	var flipperDataError = function flipperDataError(err) {
		console.log('err', err);
	};

	var flipperDataSuccess = function flipperDataSuccess(data) {
		var $flipperContainer = $(flipperContainerSelector);
		var $flipperTabs = $flipperContainer.find(flipperTabSelector);

		$flipperTabs.each(function (index, tab) {
			var $tab = $(tab);
			var tabType = $tab.attr('data-flipper-tab');

			$.each(data, function (index1, tabData) {
				if (tabType.toLowerCase() === tabData.type.toLowerCase()) {
					$.each(tabData.books, function (index2, book) {
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

	var highlightButtons = function highlightButtons(tabObjects, index) {
		var $allButtons = tabObjects.$flipperTabs.find('button');
		var $visibleButtons = tabObjects.$flipperTabs.filter(':visible').find('button');
		var $bookTitle = tabObjects.$flipperContainer.find('.book-title');
		var $bookDescription = tabObjects.$flipperContainer.find('.book-description');
		var $bookUrl = tabObjects.$flipperContainer.find('.book-url');
		var $bookCover = tabObjects.$flipperContainer.find('.book-cover');
		var $chosenButton = $visibleButtons.eq(index);

		$allButtons.removeClass('active');
		$chosenButton.addClass('active');

		$bookTitle.text($chosenButton.attr('data-title'));
		$bookDescription.text($chosenButton.attr('data-description'));
		$bookUrl.attr('href', $chosenButton.attr('data-url'));
		$bookCover.attr('src', $chosenButton.attr('data-cover-url'));

		return index === $visibleButtons.length - 1 ? 0 : index + 1;
	};

	var bookButtonClicked = function bookButtonClicked(event) {
		var $button = $(event.currentTarget);

		buttonIndex = $button.index();
		highlightButtons(event.data.tabObjects, buttonIndex);
	};

	var flipperSetup = function flipperSetup(tabObjects) {
		var $buttons = tabObjects.$flipperTabs.find('button');
		$buttons.on('click', { tabObjects: tabObjects }, bookButtonClicked);

		buttonIndex = highlightButtons(tabObjects, buttonIndex);
	};

	var init = function init() {
		$.getJSON(CONSTANTS.homepage.urls.flipper).then(flipperDataSuccess, flipperDataError).then(flipperSetup);
	};

	return { init: init };
}(jQuery, bcpl.constants);

$(function () {
	bcpl.pageSpecific.homepage.flipper.init();
});