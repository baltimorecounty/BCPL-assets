'use strict';

/*
 * Creates namespaces safely and conveniently, reusing 
 * existing objects instead of overwriting them.
 */
var namespacer = function namespacer(ns) {
	var nsArr = ns.split('.'),
	    parent = window;

	if (!nsArr.length) return;

	for (var i = 0; i < nsArr.length; i++) {
		var nsPart = nsArr[i];

		if (typeof parent[nsPart] === 'undefined') {
			parent[nsPart] = {};
		}

		parent = parent[nsPart];
	}
};
'use strict';

namespacer('seniorExpo.utility');

seniorExpo.utility.flexDetect = function (document, $, undefined) {

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
  'use strict';

  var
  /*
         * We want to consider the column text to be a number if it starts with a dollar 
         * sign, so let's peek at the first character and see if that's the case.
         * Don't worry, if it's just a normal number, it's handled elsewhere.
         */
  getIndexOfFirstDigit = function getIndexOfFirstDigit(numberString) {
    var startsWithCurrencyRegex = /[\$]/;
    return startsWithCurrencyRegex.test(numberString[0]) && numberString.length > 1 ? 1 : 0;
  },


  /*
   * Is the first character of the value in question a number (without the dollar sign, if present)? 
   * If so, return the value as an actual number, rather than a string of numbers.
   */
  extractNumbersIfPresent = function extractNumbersIfPresent(stringOrNumber) {
    var firstCharacterIndex = getIndexOfFirstDigit(stringOrNumber),
        stringOrNumberPossiblyWithoutFirstCharacter = stringOrNumber.slice(firstCharacterIndex),
        firstSetOfNumbers = getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumberPossiblyWithoutFirstCharacter);
    return typeof firstSetOfNumbers === 'number' ? firstSetOfNumbers : stringOrNumber;
  },


  /*
   * Here, we're converting the first group of characters to a number, so we can sort 
   * numbers numerically, rather than alphabetically.
   */
  getFirstSetOfNumbersAndRemoveNonDigits = function getFirstSetOfNumbersAndRemoveNonDigits(numbersAndAssortedOtherCharacters) {
    var allTheDigitsRegex = /^\.{0,1}(\d+[\,\.]{0,1})*\d+\b/,
        extractedNumerics = numbersAndAssortedOtherCharacters.match(allTheDigitsRegex);
    return extractedNumerics ? parseFloat(extractedNumerics[0].split(',').join('')) : numbersAndAssortedOtherCharacters;
  };

  return {
    getIndexOfFirstDigit: getIndexOfFirstDigit,
    extractNumbersIfPresent: extractNumbersIfPresent,
    getFirstSetOfNumbersAndRemoveNonDigits: getFirstSetOfNumbersAndRemoveNonDigits
  };
}();
'use strict';

namespacer("bcpl");

bcpl.alertBox = function ($, undefined) {
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
	var menuSelector = '.nav-and-search nav';

	/**
  * Attach events and inject any event dependencies.
  */
	var init = function init() {
		var $searchButtonActivator = $(searchButtonActivatorSelector);
		var $searchBox = $(searchBoxSelector);
		var $searchButton = $(searchButtonSelector);
		var $menu = $(menuSelector);

		$searchButtonActivator.on('click', {
			$searchBox: $searchBox,
			$searchButtonActivator: $searchButtonActivator,
			$menu: $menu
		}, searchButtonActivatorClicked);

		$searchButton.on('click', searchButtonClicked);
	};

	/**
  * Click event handler for the search activator button.
  */
	var searchButtonActivatorClicked = function searchButtonActivatorClicked(event) {
		var $searchBox = event.data.$searchBox;
		var $searchButtonActivator = event.data.$searchButtonActivator;
		var $menu = event.data.$menu;

		$searchButtonActivator.toggleClass('active');
		$searchBox.toggleClass('active');
		$menu.toggleClass('hidden-xs');
	};

	/**
  * Click event handler for the search button.
  */
	var searchButtonClicked = function searchButtonClicked(event) {};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.navigationSearch.init();
});