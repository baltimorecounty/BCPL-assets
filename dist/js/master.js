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

namespacer('bcpl.utility');

bcpl.utility.flexDetect = function (document, $) {
	var init = function init(testDoc) {
		var actualDoc = testDoc || document;

		var hasFlex = actualDoc.createElement('div').style.flex !== undefined;

		if (!hasFlex) {
			$('body').addClass('no-flex');
		}
	};

	return { init: init };
}(document, jQuery);

$(function () {
	bcpl.utility.flexDetect.init();
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
	var getAsDictionary = function getAsDictionary(targetWindow) {
		var windowToUse = targetWindow || window;

		if (windowToUse.location.search) {
			var qs = windowToUse.location.search.slice(1);
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

bcpl.constants = {
	baseApiUrl: 'http://localhost:3000',
	basePageUrl: '/dist',
	keyCodes: {
		enter: 13,
		escape: 27,
		upArrow: 38,
		downArrow: 40,
		leftArrow: 37,
		rightArrow: 39,
		tab: 9,
		space: 32
	}
};
'use strict';

namespacer('bcpl');

bcpl.navigationSearch = function ($) {
	var searchButtonActivatorSelector = '#activate-search-button';
	var searchBoxSelector = '#search-box';
	var searchButtonSelector = '#search-button';
	var hamburgerButtonSelector = '#hamburger-menu-button';
	var menuSelector = '.nav-and-search nav';
	var navBackButtonSelector = 'nav > .nav-back-button button';
	var modalCoverSelector = '#modal-cover';
	var menuItemsSelector = '.nav-and-search nav > ul > li > button';
	// const submenuBackButtonSelector = '.nav-and-search nav ul li ul li.nav-back-button button';

	/* Helpers */

	var killMenuAndModalCover = function killMenuAndModalCover($menu, $modalCover) {
		$modalCover.removeClass('active');
		$menu.removeClass('active move-left').find('.slide-in').removeClass('slide-in');
		$('nav .clicked').removeClass('clicked');
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

		if ($('nav .clicked').length) {
			$('nav .clicked').removeClass('clicked');
		} else {
			killMenuAndModalCover($menu, $modalCover);
		}
	};

	/**
  * Handles the menu item clicks that slide out the next nav
  * @param {Event} event
  */
	var menuItemClicked = function menuItemClicked(event) {
		var $button = $(event.currentTarget);

		$('nav .clicked').removeClass('clicked');
		$button.parent().addClass('clicked');
	};

	var submenuBackButtonClicked = function submenuBackButtonClicked(event) {
		var $backButton = $(event.currentTarget);
		$backButton.closest('.slide-in').removeClass('slide-in');
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
				if (callback) {
					callback();
				}
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

		$searchButton.on('click', {
			browserWindow: window
		}, searchButtonClicked);

		$navBackButton.on('click', {
			$menu: $menu,
			$modalCover: $modalCover
		}, modalDismissActionHandler);

		$modalCover.on('click', {
			$menu: $menu,
			$modalCover: $modalCover
		}, modalDismissActionHandler);

		$menuItems.on('click', {
			$menu: $menu
		}, menuItemClicked);

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

bcpl.navigation = function ($, keyCodes) {
	var navButtonSelector = '.nav-and-search nav button';

	var findClosestButtonToLink = function findClosestButtonToLink($link) {
		return $link.closest('nav>ul>li').find('button');
	};

	var focusFirstActiveMenuLink = function focusFirstActiveMenuLink() {
		return $('nav li.active ul li:first-child a').focus();
	};

	var activateSubmenu = function activateSubmenu($button) {
		return $button.attr('aria-expanded', true).closest('li').addClass('active').find('ul').attr('aria-hidden', false);
	};

	var deactivateSubmenu = function deactivateSubmenu($button) {
		return $button.attr('aria-expanded', false).closest('li').removeClass('active').find('ul').attr('aria-hidden', true);
	};

	var removeActiveClassFromAllButtons = function removeActiveClassFromAllButtons() {
		return deactivateSubmenu($('nav').find('li.active button'));
	};

	var hideSearchBox = function hideSearchBox() {
		return $('#activate-search-button, #search-box').removeClass('active');
	};

	var hideHeroCallout = function hideHeroCallout(shouldHide) {
		return shouldHide ? $('.hero-callout-container').hide() : $('.hero-callout-container').show();
	};

	var navButtonClicked = function navButtonClicked(event) {
		var $button = $(event.currentTarget);
		var isActive = $button.closest('li').hasClass('active');
		hideSearchBox();
		removeActiveClassFromAllButtons();
		if (!isActive) {
			activateSubmenu($button);
			hideHeroCallout(true);
		} else {
			deactivateSubmenu($button);
			hideHeroCallout(false);
		}
	};

	var navigationKeyPressed = function navigationKeyPressed(keyboardEvent) {
		var keyCode = keyboardEvent.which || keyboardEvent.keyCode;

		switch (keyCode) {
			case keyCodes.escape:
				deactivateSubmenu($('nav li.active button'));
				break;
			default:
				break;
		}
	};

	var navigationButtonKeyPressed = function navigationButtonKeyPressed(keyboardEvent) {
		var keyCode = keyboardEvent.which || keyboardEvent.keyCode;
		var $button = $(keyboardEvent.currentTarget);

		switch (keyCode) {
			case keyCodes.rightArrow:
				keyboardEvent.preventDefault();
				deactivateSubmenu($button);
				$button.parent().next().find('button').focus();
				break;
			case keyCodes.leftArrow:
				keyboardEvent.preventDefault();
				deactivateSubmenu($button);
				$button.parent().prev().find('button').focus();
				break;
			case keyCodes.downArrow:
			case keyCodes.upArrow:
				keyboardEvent.preventDefault();
				activateSubmenu($button);
				$button.siblings('ul').find('li').eq(0).find('a').focus();
				break;
			default:
				break;
		}
	};

	var navigationMenuItemKeyPressed = function navigationMenuItemKeyPressed(keyboardEvent) {
		var keyCode = keyboardEvent.which || keyboardEvent.keyCode;
		var $link = $(keyboardEvent.currentTarget);

		switch (keyCode) {
			case keyCodes.upArrow:
				keyboardEvent.preventDefault();
				$link.closest('li').prev().find('a').focus();
				break;
			case keyCodes.leftArrow:
				keyboardEvent.preventDefault();
				if ($link.closest('nav>ul>li').prev('li').length) {
					deactivateSubmenu(findClosestButtonToLink($link));
					activateSubmenu($link.closest('nav>ul>li').prev('li').find('button'));
					focusFirstActiveMenuLink();
				}
				break;
			case keyCodes.downArrow:
				keyboardEvent.preventDefault();
				$link.closest('li').next().find('a').focus();
				break;
			case keyCodes.rightArrow:
				keyboardEvent.preventDefault();
				if ($link.closest('nav>ul>li').next('li').length) {
					deactivateSubmenu(findClosestButtonToLink($link));
					activateSubmenu($link.closest('nav>ul>li').next('li').find('button'));
					focusFirstActiveMenuLink();
				}
				break;
			case keyCodes.space:
			case keyCodes.enter:
				keyboardEvent.preventDefault();
				$link[0].click();
				removeActiveClassFromAllButtons();
				break;
			default:
				break;
		}
	};

	var navigationButtonHovered = function navigationButtonHovered(mouseEvent) {
		var $button = $(mouseEvent.currentTarget);
		deactivateSubmenu($button.closest('ul').find('button'));
		activateSubmenu($button);
	};

	var navigationMouseleave = function navigationMouseleave(mouseEvent) {
		if (!$(mouseEvent.relatedTarget).closest('nav').length) {
			removeActiveClassFromAllButtons();
		}
	};

	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('keydown', 'nav', navigationKeyPressed);
	$(document).on('keydown', 'nav button', navigationButtonKeyPressed);
	$(document).on('mouseover', 'nav button', navigationButtonHovered);
	$(document).on('keydown', 'nav a', navigationMenuItemKeyPressed);
	$(document).on('mouseleave', 'nav, nav *', navigationMouseleave);
}(jQuery, bcpl.constants.keyCodes);
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