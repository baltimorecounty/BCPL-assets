'use strict';

/*
 * Creates namespaces safely and conveniently, reusing
 * existing objects instead of overwriting them.
 */
var namespacer = function namespacer(ns) {
	var nsArr = ns.split('.');
	var parent = window;

	if (!nsArr.length) {
		return;
	}

	for (var i = 0; i < nsArr.length; i += 1) {
		var nsPart = nsArr[i];

		if (typeof parent[nsPart] === 'undefined') {
			parent[nsPart] = {};
		}

		parent = parent[nsPart];
	}
};
'use strict';

namespacer('seniorExpo.utility');

seniorExpo.utility.flexDetect = function (document, $) {
	var init = function init() {
		var hasFlex = document.createElement('div').style.flex !== undefined;

		if (!hasFlex) {
			$('body').addClass('no-flex');
		}
	};

	return { init: init };
}(document, jQuery);

$(function () {
	seniorExpo.utility.flexDetect.init();
});
'use strict';

namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.numericStringTools = function () {
	/*
 * We want to consider the column text to be a number if it starts with a dollar
 * sign, so let's peek at the first character and see if that's the case.
 * Don't worry, if it's just a normal number, it's handled elsewhere.
 */
	var getIndexOfFirstDigit = function getIndexOfFirstDigit(numberString) {
		var startsWithCurrencyRegex = /[$]/;
		return startsWithCurrencyRegex.test(numberString[0]) && numberString.length > 1 ? 1 : 0;
	};

	/*
 * Here, we're converting the first group of characters to a number, so we can sort
 * numbers numerically, rather than alphabetically.
 */
	var getFirstSetOfNumbersAndRemoveNonDigits = function getFirstSetOfNumbersAndRemoveNonDigits(numbersAndAssortedOtherCharacters) {
		var allTheDigitsRegex = /^\.{0,1}(\d+[,.]{0,1})*\d+\b/;
		var extractedNumerics = numbersAndAssortedOtherCharacters.match(allTheDigitsRegex);
		return extractedNumerics ? parseFloat(extractedNumerics[0].split(',').join('')) : numbersAndAssortedOtherCharacters;
	};

	/*
 * Is the first character of the value in question a number (without the dollar sign, if present)?
 * If so, return the value as an actual number, rather than a string of numbers.
 */
	var extractNumbersIfPresent = function extractNumbersIfPresent(stringOrNumber) {
		var firstCharacterIndex = getIndexOfFirstDigit(stringOrNumber);
		var stringOrNumberPossiblyWithoutFirstCharacter = stringOrNumber.slice(firstCharacterIndex);
		var firstSetOfNumbers = getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumberPossiblyWithoutFirstCharacter);
		return typeof firstSetOfNumbers === 'number' ? firstSetOfNumbers : stringOrNumber;
	};

	return {
		getIndexOfFirstDigit: getIndexOfFirstDigit,
		extractNumbersIfPresent: extractNumbersIfPresent,
		getFirstSetOfNumbersAndRemoveNonDigits: getFirstSetOfNumbersAndRemoveNonDigits
	};
}();
'use strict';

namespacer('bcpl.utility');

bcpl.utility.querystringer = function () {
	/**
  * Turns the querystring key/value pairs into a dictionary.
  *
  * Important: All of the returned dictionary's keys will be lower-cased.
  */
	var getAsDictionary = function getAsDictionary() {
		if (window.location.search) {
			var qs = window.location.search.slice(1);
			var qsArray = qs.split('&');
			var qsDict = {};

			for (var i = 0; i < qsArray.length; i += 1) {
				var KEY = 0;
				var VALUE = 1;
				var keyValueArr = qsArray[i].split('=');

				qsDict[keyValueArr[KEY].toLowerCase()] = keyValueArr.length === 2 ? keyValueArr[VALUE] : '';
			}

			return qsDict;
		}

		return false;
	};

	return {
		getAsDictionary: getAsDictionary
	};
}();
'use strict';

namespacer('bcpl');

bcpl.alertBox = function ($) {
	var alertBoxDismissButtonSelector = '#alert-box-dismiss';
	var alertBoxContainerSelector = '.alert-container';

	var $alertBoxDismissButton = void 0;
	var $alertBoxContainer = void 0;

	var alertBoxDismissButtonClicked = function alertBoxDismissButtonClicked(event) {
		var $container = event.data.$container;

		$container.addClass('dismissed');
		sessionStorage.setItem('isAlertDismissed', true);
	};

	var init = function init() {
		$alertBoxDismissButton = $(alertBoxDismissButtonSelector);
		$alertBoxContainer = $alertBoxDismissButton.closest(alertBoxContainerSelector);
		$alertBoxDismissButton.on('click', { $container: $alertBoxContainer }, alertBoxDismissButtonClicked);

		if (sessionStorage && !sessionStorage.getItem('isAlertDismissed') || !sessionStorage) {
			setTimeout(function () {
				$alertBoxContainer.slideDown(250);
			}, 500);
		} else {
			$alertBoxContainer.addClass('dismissed');
			$alertBoxContainer.show();
		}
	};

	return {
		init: init
	};
}(jQuery);

$(function () {
	bcpl.alertBox.init();
});
'use strict';

namespacer('bcpl');

bcpl.constants = function () {
	return {
		baseApiUrl: 'http://localhost:3000',
		basePageUrl: '/dist'
	};
}();
'use strict';

namespacer('bcpl');

bcpl.navigationSearch = function ($) {
	var searchButtonActivatorSelector = '#activate-search-button';
	var searchBoxSelector = '#search-box';
	var searchButtonSelector = '#search-button';
	var hamburgerButtonSelector = '#hamburger-menu-button';
	var menuSelector = '.nav-and-search nav';
	var navBackButtonSelector = '.nav-back-button button';
	var modalCoverSelector = '#modal-cover';
	var menuItemsSelector = '.nav-and-search nav > ul > li > button';
	var submenuBackButtonSelector = '.nav-and-search nav ul li ul li button';

	/* Helpers */

	var killMenuAndModalCover = function killMenuAndModalCover($menu, $modalCover) {
		$modalCover.removeClass('active');
		$menu.removeClass('active move-left').find('.slide-in').removeClass('slide-in');
		$('body').removeClass('nav-visible');
	};

	/* Event Handlers */

	/**
  * Click event handler for the hamburger button.
  */
	var hamburgerButtonClicked = function hamburgerButtonClicked(event) {
		var $searchBox = event.data.$searchBox;
		var $searchButtonActivator = event.data.$searchButtonActivator;
		var $menu = event.data.$menu;
		var $hamburgerButton = $(event.currentTarget);
		var $modalCover = event.data.$modalCover;

		$menu.find('.slide-in').removeClass('slide-in');
		$searchButtonActivator.removeClass('active');
		$searchBox.removeClass('active');
		$hamburgerButton.addClass('active');
		$menu.addClass('active');
		$modalCover.addClass('active');
		$('body').addClass('nav-visible');
	};

	/**
  * Click event handler for the search activator button.
  */
	var searchButtonActivatorClicked = function searchButtonActivatorClicked(event) {
		var $searchBox = event.data.$searchBox;
		var $searchButtonActivator = event.data.$searchButtonActivator;
		var $hamburgerButton = event.data.$hamburgerButton;

		if ($searchBox.is(':hidden')) {
			$searchButtonActivator.addClass('active');
			$hamburgerButton.removeClass('active');
			$searchBox.addClass('active');
		} else {
			$searchButtonActivator.removeClass('active');
			$hamburgerButton.addClass('active');
			$searchBox.removeClass('active');
		}
	};

	/**
  * Click event handler for the search button.
  */
	var searchButtonClicked = function searchButtonClicked(event) {
		var searchTerms = $(event.currentTarget).siblings('input').first().val();
		var browserWindow = event.data.browserWindow;
		browserWindow.location = bcpl.constants.basePageUrl + '/search.html?q=' + searchTerms + '&page=1&resultsPerPage=10';
	};

	/**
  * Handler for events that dismiss the menu and modal
  * @param {Event} event
  */
	var modalDismissActionHandler = function modalDismissActionHandler(event) {
		var $menu = event.data.$menu;
		var $modalCover = event.data.$modalCover;
		killMenuAndModalCover($menu, $modalCover);
	};

	/**
  * Handles the menu item clicks that slide out the next nav
  * @param {Event} event
  */
	var menuItemClicked = function menuItemClicked(event) {
		var $menuItem = $(event.currentTarget);
		var $submenu = $menuItem.siblings('ul');
		var $menu = event.data.$menu;

		$menu.find('.slide-in').removeClass('slide-in');
		$menu.addClass('move-left');
		$submenu.addClass('slide-in');
	};

	var submenuBackButtonClicked = function submenuBackButtonClicked(event) {
		var $backButton = $(event.currentTarget);
		$backButton.closest('.slide-in').removeClass('slide-in');
		$backButton.closest('.move-left').removeClass('move-left');
	};

	var resizeTimer = void 0;

	var windowResized = function windowResized(event, callback) {
		var $menu = event.data.$menu;
		var $modalCover = event.data.$modalCover;

		if (parseFloat($('body').css('width')) > 768 && $menu.hasClass('animatable')) {
			killMenuAndModalCover($menu, $modalCover);
			$menu.removeClass('animatable');
		} else {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				$menu.addClass('animatable');
				callback();
			}, 500);
		}
	};

	/**
  * Attach events and inject any event dependencies.
  */
	var init = function init() {
		var $searchButtonActivator = $(searchButtonActivatorSelector);
		var $searchBox = $(searchBoxSelector);
		var $searchButton = $(searchButtonSelector);
		var $hamburgerButton = $(hamburgerButtonSelector);
		var $menu = $(menuSelector);
		var $navBackButton = $(navBackButtonSelector);
		var $modalCover = $(modalCoverSelector);
		var $menuItems = $(menuItemsSelector);
		var $submenuBackButton = $(submenuBackButtonSelector);

		$searchButtonActivator.on('click', {
			$searchBox: $searchBox,
			$searchButtonActivator: $searchButtonActivator,
			$hamburgerButton: $hamburgerButton
		}, searchButtonActivatorClicked);

		$hamburgerButton.on('click', {
			$searchBox: $searchBox,
			$searchButtonActivator: $searchButtonActivator,
			$menu: $menu,
			$modalCover: $modalCover
		}, hamburgerButtonClicked);

		$searchButton.on('click', { browserWindow: window }, searchButtonClicked);

		$navBackButton.on('click', {
			$menu: $menu,
			$modalCover: $modalCover
		}, modalDismissActionHandler);

		$modalCover.on('click', {
			$menu: $menu,
			$modalCover: $modalCover
		}, modalDismissActionHandler);

		$menuItems.on('click', { $menu: $menu }, menuItemClicked);

		$submenuBackButton.on('click', submenuBackButtonClicked);

		$(window).on('resize', {
			$menu: $menu,
			$modalCover: $modalCover
		}, windowResized);

		if (parseFloat($('body').css('width')) <= 768) {
			$menu.addClass('animatable');
		}
	};

	return {
		init: init
	};
}(jQuery);

$(function () {
	bcpl.navigationSearch.init();
});
'use strict';

namespacer('bcpl');

bcpl.navigation = function ($) {
	var navButtonSelector = '.nav-and-search nav button';
	var navButtonAndListSelector = '.nav-and-search nav li.active button, .nav-and-search nav li.active ul';

	var keyCodes = {
		enter: 13
	};

	var removeActiveClassFromAllButtons = function removeActiveClassFromAllButtons($button) {
		return $button.closest('ul').find('li.active').removeClass('active');
	};

	var toggleActiveClass = function toggleActiveClass($button) {
		return $button.closest('li').toggleClass('active');
	};

	var removeActiveClass = function removeActiveClass($buttonOrList) {
		return $buttonOrList.closest('.active').removeClass('active');
	};

	var hideSearchBox = function hideSearchBox() {
		$('#activate-search-button, #search-box').removeClass('active');
	};

	var equalizeListItems = function equalizeListItems($childOfTargetList) {
		var $wideList = $childOfTargetList.siblings('ul');
		var $listItems = $wideList.find('li');
		var widest = 0;
		var tallest = 0;

		if ($listItems.length < 8) return;

		$listItems.each(function (listItemIndex, listItem) {
			var $listItem = $(listItem);
			widest = $listItem.width() > widest ? $listItem.width() : widest;
			tallest = $listItem.height() > tallest ? $listItem.height() : tallest;
		});

		$listItems.width(widest);
		$listItems.height(tallest);
		$wideList.addClass('wide');
	};

	var navButtonKeyup = function navButtonKeyup(event) {
		var $button = $(event.currentTarget);
		var keyCode = event.which || event.keyCode;

		if (keyCode === keyCodes.enter) {
			hideSearchBox();
			removeActiveClassFromAllButtons($button);
			toggleActiveClass($button);
			equalizeListItems($button);
		}
	};

	var navButtonClicked = function navButtonClicked(event) {
		var $button = $(event.currentTarget);
		hideSearchBox();
		removeActiveClassFromAllButtons($button);
		toggleActiveClass($button);
		equalizeListItems($button);
	};

	var navButtonHovered = function navButtonHovered(event) {
		var $button = $(event.currentTarget);
		hideSearchBox();
		removeActiveClassFromAllButtons($button);
		equalizeListItems($button);
	};

	var navButtonAndListLeave = function navButtonAndListLeave(event) {
		var $buttonOrList = $(event.currentTarget);
		hideSearchBox();
		removeActiveClass($buttonOrList);
	};

	$(document).on('keyup', navButtonSelector, navButtonKeyup);
	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('mouseenter', navButtonSelector, navButtonHovered);
	$(document).on('mouseleave', navButtonAndListSelector, navButtonAndListLeave);
}(jQuery);
'use strict';

namespacer('bcpl');

bcpl.tabs = function ($) {
	var tabContainerSelector = '.tabs';
	var tabControlSelector = '.tab-control';
	var tabSelector = '.tab';

	var tabControlClicked = function tabControlClicked(event) {
		var $targetTabControl = $(event.currentTarget);
		var $tabs = event.data.$tabContainer.find(tabSelector);
		var tabControlIndex = $targetTabControl.index();

		event.data.$tabControls.removeClass('active');
		$tabs.removeClass('active');
		$targetTabControl.addClass('active');
		$tabs.eq(tabControlIndex).addClass('active');
	};

	var init = function init() {
		var $tabContainer = $(tabContainerSelector);
		var $tabControls = $tabContainer.find(tabControlSelector);

		$tabControls.on('click', {
			$tabContainer: $tabContainer,
			$tabControls: $tabControls
		}, tabControlClicked);
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.tabs.init();
});