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
 * Is the first character of the value in question a number (without the dollar sign, if present)?
 * If so, return the value as an actual number, rather than a string of numbers.
 */
	var extractNumbersIfPresent = function extractNumbersIfPresent(stringOrNumber) {
		var firstCharacterIndex = getIndexOfFirstDigit(stringOrNumber);
		var stringOrNumberPossiblyWithoutFirstCharacter = stringOrNumber.slice(firstCharacterIndex);
		var firstSetOfNumbers = getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumberPossiblyWithoutFirstCharacter);
		return typeof firstSetOfNumbers === 'number' ? firstSetOfNumbers : stringOrNumber;
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

	return {
		getIndexOfFirstDigit: getIndexOfFirstDigit,
		extractNumbersIfPresent: extractNumbersIfPresent,
		getFirstSetOfNumbersAndRemoveNonDigits: getFirstSetOfNumbersAndRemoveNonDigits
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

bcpl.navigationSearch = function ($) {
	var searchButtonActivatorSelector = '#activate-search-button';
	var searchBoxSelector = '#search-box';
	var searchButtonSelector = '#search-button';
	var hamburgerButtonSelector = '#hamburger-menu-button';
	var menuSelector = '.nav-and-search nav';

	var hamburgerButtonClicked = function hamburgerButtonClicked(event) {
		var $searchBox = event.data.$searchBox;
		var $searchButtonActivator = event.data.$searchButtonActivator;
		var $menu = event.data.$menu;
		var $hamburgerButton = $(event.currentTarget);

		if ($menu.is(':hidden')) {
			$searchButtonActivator.removeClass('active');
			$searchBox.removeClass('active');
			$hamburgerButton.addClass('active');
			$menu.removeClass('hidden-xs');
		}
	};

	/**
  * Click event handler for the search activator button.
  */
	var searchButtonActivatorClicked = function searchButtonActivatorClicked(event) {
		var $searchBox = event.data.$searchBox;
		var $searchButtonActivator = event.data.$searchButtonActivator;
		var $menu = event.data.$menu;
		var $hamburgerButton = event.data.$hamburgerButton;

		if ($searchBox.is(':hidden')) {
			$searchButtonActivator.addClass('active');
			$hamburgerButton.removeClass('active');
			$searchBox.addClass('active');
			$menu.addClass('hidden-xs');
		} else {
			$searchButtonActivator.removeClass('active');
			$hamburgerButton.addClass('active');
			$searchBox.removeClass('active');
			$menu.removeClass('hidden-xs');
		}
	};

	/**
  * Click event handler for the search button.
  */
	var searchButtonClicked = function searchButtonClicked(event) {};

	/**
 * Attach events and inject any event dependencies.
 */
	var init = function init() {
		var $searchButtonActivator = $(searchButtonActivatorSelector);
		var $searchBox = $(searchBoxSelector);
		var $searchButton = $(searchButtonSelector);
		var $hamburgerButton = $(hamburgerButtonSelector);
		var $menu = $(menuSelector);

		$searchButtonActivator.on('click', {
			$searchBox: $searchBox,
			$searchButtonActivator: $searchButtonActivator,
			$menu: $menu,
			$hamburgerButton: $hamburgerButton
		}, searchButtonActivatorClicked);

		$hamburgerButton.on('click', {
			$searchBox: $searchBox,
			$searchButtonActivator: $searchButtonActivator,
			$menu: $menu
		}, hamburgerButtonClicked);

		$searchButton.on('click', searchButtonClicked);
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.navigationSearch.init();
});
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