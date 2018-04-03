'use strict';

/*
 * Creates namespaces safely and conveniently, reusing
 * existing objects instead of overwriting them.
 */
var namespacer = function namespacer(ns) {
	if (!ns) {
		return;
	}

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

namespacer('bcpl');

bcpl.constants = {
	// baseApiUrl: 'http://oit226696:3100',
	baseApiUrl: 'https://testservices.bcpl.info',
	baseCatalogUrl: 'https://ils-test.bcpl.lib.md.us',
	baseWebsiteUrl: 'https://staging.bcpl.info',
	basePageUrl: '/dist',
	defaultDocument: 'index.html',
	keyCodes: {
		enter: 13,
		escape: 27,
		upArrow: 38,
		downArrow: 40,
		leftArrow: 37,
		rightArrow: 39,
		tab: 9,
		space: 32
	},
	breakpoints: {
		large: 1200,
		medium: 992,
		small: 768,
		xsmall: 480
	},
	search: {
		urls: {
			materialTypes: '/sebin/y/r/primaryMaterialType.json',
			catalog: '/polaris/view.aspx?keyword=',
			events: '/events-and-programs/list.html#!/?term=',
			website: '/search-results.html?term=',
			api: '/api/swiftype/site-search',
			trackClickThrough: '/api/swiftype/track'
		}
	},
	homepage: {
		urls: {
			flipper: '/sebin/y/d/homepage-flipper.json',
			events: '/api/evanced/signup/events'
		}
	},
	libAnswers: {
		allBranchIds: [6319, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874, 6875, 6876, 6877, 6878, 6879, 6777, 6880, 6881],
		generalBranchId: 7783,
		widgetJs: '//api2.libanswers.com/js2.18.5/LibAnswers_widget.min.js'
	},
	shared: {
		urls: {
			alerts: '/api/structured-content/alerts',
			alertNotification: '/api/structured-content/alerts-notification',
			bookCarousels: 'https://catalog.bcpl.lib.md.us/ContentXchange/APICarouselToolkit/1/CAROUSEL_ID/2'
		}
	},
	expressions: {
		justWordCharacters: /\w+/g
	}
};
'use strict';

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
            value: function value(predicate) {
                  // 1. Let O be ? ToObject(this value).
                  if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                  }

                  var o = Object(this);

                  // 2. Let len be ? ToLength(? Get(O, "length")).
                  var len = o.length >>> 0;

                  // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                  if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                  }

                  // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                  var thisArg = arguments[1];

                  // 5. Let k be 0.
                  var k = 0;

                  // 6. Repeat, while k < len
                  while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return kValue.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                              return kValue;
                        }
                        // e. Increase k by 1.
                        k++;
                  }

                  // 7. Return undefined.
                  return undefined;
            }
      });
}
'use strict';

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		value: function value(searchElement, fromIndex) {
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			// 1. Let O be ? ToObject(this value).
			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// 3. If len is 0, return false.
			if (len === 0) {
				return false;
			}

			// 4. Let n be ? ToInteger(fromIndex).
			//    (If fromIndex is undefined, this step produces the value 0.)
			var n = fromIndex | 0;

			// 5. If n ≥ 0, then
			//  a. Let k be n.
			// 6. Else n < 0,
			//  a. Let k be len + n.
			//  b. If k < 0, let k be 0.
			var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

			function sameValueZero(x, y) {
				return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
			}

			// 7. Repeat, while k < len
			while (k < len) {
				// a. Let elementK be the result of ? Get(O, ! ToString(k)).
				// b. If SameValueZero(searchElement, elementK) is true, return true.
				if (sameValueZero(o[k], searchElement)) {
					return true;
				}
				// c. Increase k by 1.
				k++;
			}

			// 8. Return false
			return false;
		}
	});
}
'use strict';

namespacer('bcpl.utility');

bcpl.utility.browserStorage = function (localStorage) {
	/**
  * Local storage management.
  * @param {string} key Key for the stored item.
  * @param {string} [value] Value to set.
  */
	var local = function local(key, value) {
		if (!localStorage) {
			return console.error('Local storage is not supported in this browser.');
		}

		if (key && typeof key === 'string') {
			if (value && typeof value === 'string') {
				return setLocalValue(key, value);
			}

			return getLocalValue(key);
		}

		return console.error('Your local storage key must be a string. Nothing stored.');
	};

	/**
  * Retrieves a value from local storage.
  * @param {string} key Key for the stored item.
  */
	var getLocalValue = function getLocalValue(key) {
		try {
			return localStorage.getItem(key);
		} catch (error) {
			return console.error(error);
		}
	};

	/**
  * Sets a value in local storage.
  * @param {string} key Key for the stored item.
  * @param {string} value Value to set.
  */
	var setLocalValue = function setLocalValue(key, value) {
		try {
			return localStorage.setItem(key, value);
		} catch (error) {
			return console.error(error);
		}
	};

	return {
		local: local
	};
}(localStorage);
"use strict";

(function () {

	if (typeof window.CustomEvent === "function") return false;

	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();
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

namespacer('bcpl.utility');

bcpl.utility.format = function format() {
	'use strict';

	function formatCurrency(input) {
		if (!input) {
			return;
		}

		if (typeof input === 'string') {
			input = parseFloat(input);
		}

		var currencyFormatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
			// the default value for minimumFractionDigits depends on the currency
			// and is usually already 2
		});

		return currencyFormatter.format(input);
	}

	function formatPhoneNumber(input, format) {
		if (typeof input === 'number') {
			input = input.toString();
		}

		var exp = /\d+/g;
		var numbersOnly = input.match(exp).join('').split('');
		var numberOfXs = format.split('').filter(function (char) {
			return char === 'x';
		}).length;
		var hasOneAsPrefix = numberOfXs + 1 === numbersOnly.length;

		// 1 has been included in the str, but is not in the desired format
		if (hasOneAsPrefix) {
			numbersOnly.shift();
		}

		if (numberOfXs === numbersOnly.length || hasOneAsPrefix) {
			numbersOnly.forEach(function (number) {
				format = format.replace('x', number);
			});
		} else {
			console.error('Incorrect Format. Double Check your values.');
			return null;
		}

		return format;
	}

	var _formatters = {
		currency: formatCurrency,
		phoneNumber: formatPhoneNumber
	};

	function format(key, val, strFormat) {
		return _formatters[key](val, strFormat);
	}

	return format;
}();
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

namespacer('bcpl.utility');

bcpl.utility.regexTools = function () {
	/**
  * Filters a string down to only characters that match the regex.
  *
  * @param {string} stringToFilter
  * @param {RegExp} filterRegex
  */
	var removeMatchingCharacters = function removeMatchingCharacters(stringToFilter, filterRegex) {
		var match = void 0;
		var matches = [];

		/* eslint-disable no-cond-assign */
		while ((match = filterRegex.exec(stringToFilter)) !== null) {
			matches.push(match[0]);
		}

		return matches.join('');
	};

	return { removeMatchingCharacters: removeMatchingCharacters };
}();
'use strict';

/* eslint-disable no-extend-native */

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function endsWith(searchString, position) {
		var subjectString = this.toString();

		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}

		position -= searchString.length;

		var lastIndex = subjectString.indexOf(searchString, position);

		return lastIndex !== -1 && lastIndex === position;
	};
}
'use strict';

namespacer('bcpl.utility');

bcpl.utility.urlComparer = function (constants) {
	var hrefEndingTypes = {
		fileName: 0,
		slash: 1,
		folderName: 2
	};

	var getEndingType = function getEndingType(href) {
		var hrefParts = href.split('/');
		var lastHrefPart = hrefParts[hrefParts.length - 1];
		var lastPeriodIndex = lastHrefPart.lastIndexOf('.');
		var lastSlashIndex = lastHrefPart.lastIndexOf('/');

		if (lastHrefPart === '') {
			return hrefEndingTypes.slash;
		}

		if (lastPeriodIndex > -1 && lastPeriodIndex > lastSlashIndex) {
			return hrefEndingTypes.fileName;
		}

		return hrefEndingTypes.folderName;
	};

	var isSamePage = function isSamePage(navHref, locationHref) {
		var navLinkEndingType = getEndingType(navHref);
		var locationEndingType = getEndingType(locationHref);

		if (navLinkEndingType === locationEndingType) {
			return locationHref.endsWith(navHref);
		}

		switch (locationEndingType) {
			case hrefEndingTypes.folderName:
				return removeFilenameAndTrailingSlash(navHref, navLinkEndingType).endsWith(locationHref);
			case hrefEndingTypes.slash:
				return (removeFilenameAndTrailingSlash(navHref, navLinkEndingType) + '/').endsWith(locationHref);
			default:
				return navHref.endsWith(locationHref);
		}
	};

	var removeFilenameAndTrailingSlash = function removeFilenameAndTrailingSlash(url, endingType) {
		var urlParts = url.split('/');
		var urlPartsLength = urlParts.length;
		var isIndexPage = urlParts[urlParts.length - 1].toLowerCase() === constants.defaultDocument;

		if (endingType === hrefEndingTypes.folderName) {
			return url;
		}

		if (urlPartsLength > 0 && endingType === hrefEndingTypes.fileName && !isIndexPage) {
			return url;
		}

		switch (urlPartsLength) {
			case 0:
				return ''; // this should never happen, but let's compensate just in case
			case 1:
				return urlParts[0]; // this means we just have a filename or foldername
			default:
				return Array.prototype.join.call(urlParts.slice(0, urlParts.length - 1), '/'); // removes filename and trailing slash
		}
	};

	return {
		isSamePage: isSamePage,
		getEndingType: getEndingType,
		removeFilenameAndTrailingSlash: removeFilenameAndTrailingSlash,
		hrefEndingTypes: hrefEndingTypes
	};
}(bcpl.constants);
'use strict';

namespacer('bcpl.utility');

bcpl.utility.windowShade = function ($) {
	var windowShadeSelector = '#window-shade';
	var timeout = void 0;

	var cycle = function cycle(displaySpeed, delaySpeed) {
		var $windowShade = $(windowShadeSelector);

		clearTimeout(timeout);

		$windowShade.slideDown(displaySpeed, function () {
			timeout = setTimeout(function () {
				$windowShade.slideUp(displaySpeed);
			}, delaySpeed);
		});
	};

	return {
		cycle: cycle
	};
}(jQuery);
'use strict';

namespacer('bcpl');

bcpl.accordion = function ($) {
	var accordionIconSelector = 'h1:first-child a i, h2:first-child a i, h3:first-child a i, h4:first-child a i, p:first-child a i';
	var collapsableSelector = '.content-accordion-body';
	var panelSelector = '.content-accordion .panel';
	var collapseSelector = '.collapse';
	var htmlBodySelector = 'html, body';
	var anchorNameRegex = /^#[\w-]+$/;

	/**
  * Handles the collapseable "show" event.
  * @param {Event} collapseEvent
  */
	var onCollapsableShown = function onCollapsableShown(collapseEvent) {
		var $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton.closest(panelSelector).find(accordionIconSelector).removeClass('fa-chevron-right').addClass('fa-chevron-down');
	};

	/**
  * Handles the collapsable "hide" event.
  * @param {Event} collapseEvent
  */
	var onCollapsableHidden = function onCollapsableHidden(collapseEvent) {
		var $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton.closest(panelSelector).find(accordionIconSelector).removeClass('fa-chevron-down').addClass('fa-chevron-right');
	};

	/**
  * Scroll to the selected anchor.
  * @param {HTMLElement} anchor Anchor we're scrolling to.
  */
	var scrollToAnchor = function scrollToAnchor($anchor) {
		$(htmlBodySelector).animate({
			scrollTop: $anchor.first().offset().top
		}, 250);
	};

	/**
  * If a named anchor exists in a panel, and the location has a matching hash,
  * open it, and scroll to it.
  */
	var openPanelFromUrl = function openPanelFromUrl() {
		var anchorIdentifier = window.location.hash;

		if (anchorIdentifier && anchorIdentifier.length && anchorNameRegex.test(anchorIdentifier)) {
			var $anchor = $('a[name=' + anchorIdentifier.replace('#', '') + ']');

			if (!$anchor.length) return;

			$anchor.closest(collapseSelector).collapse('show').on('shown.bs.collapse', function () {
				return scrollToAnchor($anchor);
			});
		}
	};

	var init = function init() {
		$(document).on('show.bs.collapse', collapsableSelector, onCollapsableShown);
		$(document).on('hide.bs.collapse', collapsableSelector, onCollapsableHidden);

		openPanelFromUrl();
	};

	return { init: init };
}(jQuery);

$(function () {
	bcpl.accordion.init();
});
'use strict';

namespacer('bcpl');

bcpl.alertBox = function ($, Handlebars, CONSTANTS) {
	var alertBoxDismissButtonSelector = '#alert-box-dismiss';
	var alertBoxContainerSelector = '.alert-container';

	var $alertBoxDismissButton = void 0;
	var $alertBoxContainer = void 0;

	var alertBoxDismissButtonClicked = function alertBoxDismissButtonClicked(event) {
		var $container = event.data.$container;

		$container.addClass('dismissed').closest('.emergency').removeClass('emergency');

		if (sessionStorage) {
			sessionStorage.setItem('isAlertDismissed', true);
		}
	};

	var renderAlertBox = function renderAlertBox(alertData) {
		var alertsTemplateHtml = $('#alerts-template').html();
		var $alertsTarget = $('#alerts-target');

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			var alertsTemplate = Handlebars.compile(alertsTemplateHtml);

			if (alertData && alertData.IsEmergency) {
				alertData.EmergencyClass = 'emergency'; // eslint-disable-line no-param-reassign
			}

			$alertsTarget.html(alertsTemplate({ alertData: alertData }));
		}

		displayNotificationBar(!alertData);
	};

	var getAlertDescription = function getAlertDescription(callback) {
		if (callback && typeof callback === 'function') {
			$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alertNotification).then(function (data) {
				return onAlertSuccess(data, callback);
			}, function () {
				return onAlertError(callback);
			});
		} else {
			console.error('A missing or invalid callback has been supplied.');
		}
	};

	var onAlertSuccess = function onAlertSuccess(data, callback) {
		return data ? callback(data, true) : callback(undefined, false);
	};

	var onAlertError = function onAlertError(callback) {
		return callback(undefined, false);
	};

	var hideNotificationBar = function hideNotificationBar($container) {
		$container.addClass('dismissed').show();
	};

	var displayNotificationBar = function displayNotificationBar(shouldHide) {
		$alertBoxDismissButton = $(alertBoxDismissButtonSelector);
		$alertBoxContainer = $(alertBoxContainerSelector);
		$alertBoxDismissButton.on('click', { $container: $alertBoxContainer }, alertBoxDismissButtonClicked);

		var isAlertDismissed = sessionStorage && sessionStorage.getItem('isAlertDismissed');

		if (!isAlertDismissed && !shouldHide) {
			setTimeout(function () {
				$alertBoxContainer.slideDown(250);
			}, 500);
		} else {
			hideNotificationBar($alertBoxContainer);
		}
	};

	var init = function init() {
		getAlertDescription(function (description) {
			return renderAlertBox(description);
		});
	};

	return {
		init: init
	};
}(jQuery, Handlebars, bcpl.constants);

$(function () {
	bcpl.alertBox.init();
});
'use strict';

namespacer('bcpl');

bcpl.bookCarousel = function ($, constants) {
	var promises = [];
	var slickSettings = {
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
	var isTitleSearch = false;

	var loadData = function loadData(carouselId) {
		var url = constants.shared.urls.bookCarousels.replace('CAROUSEL_ID', carouselId);

		return $.ajax(url, {
			dataType: 'jsonp'
		}).then(function (data) {
			return onDataSuccess(data, carouselId);
		});
	};

	var textNodeFilter = function textNodeFilter(index, node) {
		return node.nodeType === 3;
	};

	var authorExtractor = function authorExtractor(textNode) {
		return $(textNode).text().split(',').slice(0, 2).join(',');
	};

	var onDataSuccess = function onDataSuccess(data, carouselId) {
		var $data = $(data.Carousel_Str);
		var $items = $data.find('li').map(function (index, element) {
			return cleanHtml(index, element);
		});

		$('.book-carousel[data-carousel-id=' + carouselId + ']').append($items.get());
	};

	var cleanHtml = function cleanHtml(index, listItem) {
		var $listItem = $(listItem);
		var $image = $listItem.find('img');
		var $link = $listItem.find('a');
		var $titleDisplay = $('<p>' + $image.attr('title') + '</p>');
		var titleRemoveString = ' : a novel';
		var title = encodeURIComponent($image.attr('title').replace(titleRemoveString, ''));

		$image.attr('src', $image.attr('src').toLowerCase().replace('sc.gif', 'mc.gif')).attr('style', '').attr('title', '').attr('alt', $image.attr('alt') + ' - book cover');

		$link.text('').append($image).append($titleDisplay);

		if (isTitleSearch) {
			var author = authorExtractor($listItem.find('div').eq(1).contents().filter(textNodeFilter));
			// const linkHref = `${constants.baseCatalogUrl}/polaris/search/searchresults.aspx?ctx=1.1033.0.0.5&type=Boolean&term=AU=%22${author}%22%20AND%20TI=%22${title}%22&by=KW&sort=MP&limit=&query=&page=0`;
			// the link below is temporary
			var linkHref = 'https://catalog.bcpl.lib.md.us/polaris/search/searchresults.aspx?ctx=1.1033.0.0.5&type=Boolean&term=AU=%22' + author + '%22%20AND%20TI=%22' + title + '%22&by=KW&sort=MP&limit=&query=&page=0';

			$link.attr('href', linkHref);
		}

		return $('<div class="inner"></div>').append($link);
	};

	var init = function init(settings) {
		var $carousels = $('.book-carousel');

		if (settings) {
			if (settings.isTitleSearch) {
				isTitleSearch = settings.isTitleSearch;
			}

			if (settings.isGrid) {
				$carousels.addClass('grid');
			}
		}

		$carousels.each(function (index, carouselElement) {
			var $carouselElement = $(carouselElement);
			var carouselId = $carouselElement.attr('data-carousel-id');

			promises.push(loadData(carouselId));
		});

		if (!settings || !settings.isGrid) {
			$.when.apply($, promises).then(function () {
				if (settings && settings.maxSlides > 0) {
					slickSettings.slidesToShow = settings.maxSlides;
				}

				$carousels.slick(slickSettings);
			});
		}
	};

	return {
		init: init
	};
}(jQuery, bcpl.constants);
'use strict';

namespacer('bcpl');

// requires bootstrap.js to be included in the page
bcpl.boostrapCollapseHelper = function ($) {
	var toggleCollapseByIds = function toggleCollapseByIds(panels) {
		var activePanels = panels.activePanels,
		    inActivePanels = panels.inActivePanels;


		activePanels.forEach(function (id) {
			$('#' + id).collapse('show');
		});

		inActivePanels.forEach(function (id) {
			$('#' + id).collapse('hide');
		});
	};

	return {
		toggleCollapseByIds: toggleCollapseByIds
	};
}(jQuery);
'use strict';

/**
 * Requires jQuery and Bootstrap
 */
namespacer('bcpl');

bcpl.breadCrumbs = function breadCrumbs($) {
	var templates = {
		popover: '<div class="popover breadcrumb-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	};
	var classNames = {
		breadCrumbContainer: 'breadcrumbs-wrapper',
		firstBreadCrumb: 'breadcrumb-first',
		hiddenBreadCrumbContainer: 'hidden-breadcrumb-container',
		hiddenBreadCrumbTrigger: 'hidden-breadcrumb-trigger',
		hiddenBreadCrumbPopover: 'hidden-breadcrumb-popover'
	};

	var selectors = {
		breadCrumbChildren: '.breadcrumbs-wrapper a, .breadcrumbs-wrapper span'
	};

	var buildBreadCrumbHtml = function buildBreadCrumbHtml(hiddenBreadCrumbTriggerClassName) {
		var hiddenBreadCrumbTriggerHtml = buildBreadCrumbTrigger(hiddenBreadCrumbTriggerClassName);
		return '<div class="' + classNames.hiddenBreadCrumbContainer + ' ' + classNames.hiddenBreadCrumbPopover + ' breadcrumb breadcrumb-alt" data-toggle="popover" id="tip1"><div class="tooltip-arrow"></div>' + hiddenBreadCrumbTriggerHtml + '</div>';
	};

	var buildBreadCrumbList = function buildBreadCrumbList($hiddenBreadCrumbs) {
		var listItems = $hiddenBreadCrumbs.toArray().map(function (hiddenBreadCrumbElm) {
			var $clonedBreadCrumb = $(hiddenBreadCrumbElm).clone();
			$clonedBreadCrumb.removeClass('breadcrumb').removeAttr('style');

			return '<li>' + $clonedBreadCrumb[0].outerHTML + '</li>';
		}).join('');

		return listItems.length ? '<ul class="hidden-breadcrumb-list">' + listItems + '</ul>' : '';
	};

	var buildBreadCrumbTrigger = function buildBreadCrumbTrigger(breadCrumbTrigger) {
		return '<span class="' + breadCrumbTrigger + '"><i class="fa fa-circle" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i></span>';
	};

	var isEmpty = function isEmpty($elm) {
		return !$.trim($elm.html().replace(/(?:\r\n|\r|\n|\s|&nbsp;)/g, ''));
	};

	var cleanBreadCrumbs = function cleanBreadCrumbs() {
		var breadCrumbContainer = '.' + classNames.breadCrumbContainer;
		var childSelector = '' + selectors.breadCrumbChildren;
		var $childHtml = $(childSelector);

		$(childSelector).remove();

		$childHtml.html(function (i, html) {
			return html.replace(/(?:\r\n|\r|\n|&nbsp;)/g, '');
		});

		$(breadCrumbContainer).append($childHtml).find('*').toArray().forEach(function (childElm) {
			var $childElm = $(childElm);
			if (isEmpty($childElm)) {
				$childElm.remove();
			}
		});
	};

	var collapseBreadCrumbs = function collapseBreadCrumbs($breadCrumbs) {
		$breadCrumbs.hide();
	};

	var createHiddenBreadCrumbs = function createHiddenBreadCrumbs() {
		var hiddenBreadCrumbHtml = buildBreadCrumbHtml(classNames.hiddenBreadCrumbTrigger);

		$('.' + classNames.firstBreadCrumb).after(hiddenBreadCrumbHtml);
	};

	var $getBreadCrumbs = function $getBreadCrumbs() {
		return $('.breadcrumbs-wrapper').find('.breadcrumb');
	};

	var $getBreadCrumbsToHide = function $getBreadCrumbsToHide($breadCrumbs) {
		return $breadCrumbs.not(':first,:last');
	};

	var initHiddenBreadCrumbsPopover = function initHiddenBreadCrumbsPopover($hiddenBreadCrumbs) {
		var hiddenBreadCrumbList = buildBreadCrumbList($hiddenBreadCrumbs);
		$('.' + classNames.hiddenBreadCrumbPopover).popover({
			content: hiddenBreadCrumbList,
			html: true,
			placement: 'bottom',
			template: templates.popover
		});
	};
	var onHiddenBreadCrumbTriggerClick = function onHiddenBreadCrumbTriggerClick(clickEvent) {
		$(clickEvent.currentTarget).toggleClass('active');
	};

	var toggleElm = function toggleElm($elm, shouldShow) {
		if (shouldShow) {
			$elm.show();
		} else {
			$elm.hide();
		}
	};

	var init = function init(breadcrumbThreshold) {
		var breadcrumbThresholdLimit = breadcrumbThreshold || 3;
		var $breadCrumbContainer = $('.' + classNames.breadCrumbContainer);

		toggleElm($breadCrumbContainer, false);

		cleanBreadCrumbs();

		var $breadCrumbs = $getBreadCrumbs();
		var numberOfBreadCrumbs = $breadCrumbs.length;

		if (numberOfBreadCrumbs > breadcrumbThresholdLimit) {
			var $hiddenBreadCrumbs = $getBreadCrumbsToHide($breadCrumbs);

			collapseBreadCrumbs($hiddenBreadCrumbs);

			createHiddenBreadCrumbs();

			initHiddenBreadCrumbsPopover($hiddenBreadCrumbs);
		}

		toggleElm($breadCrumbContainer, true);
	};

	$(document).on('click', '.hidden-breadcrumb-container', onHiddenBreadCrumbTriggerClick);

	return {
		cleanBreadCrumbs: cleanBreadCrumbs,
		collapseBreadCrumbs: collapseBreadCrumbs,
		$getBreadCrumbs: $getBreadCrumbs,
		$getBreadCrumbsToHide: $getBreadCrumbsToHide,
		init: init
	};
}(jQuery);

$(function onDocumentReady() {
	bcpl.breadCrumbs.init();
});
'use strict';

namespacer('bcpl');

bcpl.catalogSearch = function ($, queryStringer, constants) {
	var catalogSearchSelector = '#catalog-search, .catalog-search';

	var getCatalogUrl = function getCatalogUrl(searchTerm) {
		return '' + constants.baseCatalogUrl + constants.search.urls.catalog + searchTerm;
	};

	var onCatalogSearchClick = function onCatalogSearchClick(clickEvent) {
		clickEvent.preventDefault();

		var queryParams = queryStringer.getAsDictionary();
		var searchTerm = queryParams.term;

		window.location = getCatalogUrl(searchTerm);
	};

	$(document).on('click', catalogSearchSelector, onCatalogSearchClick);

	return {
		getCatalogUrl: getCatalogUrl
	};
}(jQuery, bcpl.utility.querystringer, bcpl.constants);
'use strict';

namespacer('bcpl');

bcpl.contraster = function ($, browserStorage) {
	var contrasterDefaults = {
		styleSheet: {
			high: '/sebin/x/v/master-high-contrast.min.css'
		},
		selectors: {
			contrastButton: '#contrastButton',
			stylesheetMaster: '#stylesheetMaster',
			stylesheetMasterHighContrast: '#stylesheetMasterHighContrast'
		}
	};

	var contrasterSettings = {};

	var localStorageHighContrastKey = 'isHighContrast';

	/**
  * Handles the click event of the contrast button.
  */
	var contrastButtonClickHandler = function contrastButtonClickHandler(clickEvent) {
		var settings = clickEvent ? clickEvent.data : contrasterDefaults;

		var $stylesheetMaster = $(settings.selectors.stylesheetMaster);

		if ($stylesheetMaster.length) {
			var $stylesheetMasterHighContrast = $(settings.selectors.stylesheetMasterHighContrast);

			if ($stylesheetMasterHighContrast.length) {
				$stylesheetMasterHighContrast.remove();
				browserStorage.local(localStorageHighContrastKey, 'false');
			} else {
				$stylesheetMaster.after('<link id="stylesheetMasterHighContrast" href="' + settings.styleSheet + '" rel="stylesheet">');
				browserStorage.local(localStorageHighContrastKey, 'true');
			}
		}
	};

	/**
  * Initializes the contraster with the new stylesheet.
  * @param {{ stylesheetUrl: string, contrastButtonSelector: string, stylesheetMasterSelector: string, stylesheetMasterHighContrastSelector: string }} options - Options object to set the contraster.
  */
	var init = function init(options) {
		contrasterSettings.styleSheet = options.stylesheetUrl && typeof options.stylesheetUrl === 'string' ? options.stylesheetUrl : contrasterDefaults.styleSheet.high;

		contrasterSettings.selectors = {
			contrastButton: options.contrastButtonSelector && typeof options.contrastButtonSelector === 'string' ? options.contrastButtonSelector : contrasterDefaults.selectors.contrastButton,
			stylesheetMaster: options.stylesheetMasterSelector && typeof options.stylesheetMasterSelector === 'string' ? options.stylesheetMasterSelector : contrasterDefaults.selectors.stylesheetMaster,
			stylesheetMasterHighContrast: options.stylesheetMasterHighContrastSelector && typeof options.stylesheetMasterHighContrastSelector === 'string' ? options.stylesheetMasterHighContrastSelector : contrasterDefaults.selectors.stylesheetMasterHighContrast
		};

		var $contrastButton = $(contrasterSettings.selectors.contrastButton);

		if ($contrastButton.length) {
			$contrastButton.on('click', contrasterSettings, contrastButtonClickHandler);
		}

		if (browserStorage.local(localStorageHighContrastKey) === 'true') {
			$contrastButton.trigger('click');
		} else {
			browserStorage.local(localStorageHighContrastKey, 'false');
		}
	};

	return {
		init: init
	};
}(jQuery, bcpl.utility.browserStorage);
'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.featuredEvents = function ($) {
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

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);
}(jQuery);
'use strict';

namespacer('bcpl');

bcpl.filter = function ($, windowShade) {
	var filterData = {};

	var activateTags = function activateTags($filteredContent, clickedFilterLabelText) {
		var $buttons = $filteredContent.find('.tag-list button');

		$buttons.each(function (index, buttonElement) {
			var $button = $(buttonElement);

			if ($button.text().trim().toLowerCase() === clickedFilterLabelText) {
				$button.addClass('active');
			}
		});
	};

	var render = function render(data, $template, $target, clickedFilterLabelText, isClickedFilterActive) {
		var unsortedDataItems = data.items;
		var sortedDataItems = _.sortBy(unsortedDataItems, function (item) {
			return item.name;
		});
		var dataForTemplate = data;
		dataForTemplate.items = sortedDataItems;
		var source = $template.html();
		if (source && source.length) {
			var template = Handlebars.compile(source);
			var html = template(dataForTemplate);
			$target.html(html);
		}

		if (clickedFilterLabelText && isClickedFilterActive) {
			activateTags($target, clickedFilterLabelText);
		}

		if ($target.not('.collapse').is(':hidden')) {
			$target.fadeIn(250);
		}
	};

	var generateFiltersList = function generateFiltersList(data) {
		var filters = [];

		_.each(data, function (element) {
			filters = filters.concat(element.attributes);
		});
		var uniqueFilters = _.uniq(filters);
		var sortedUniqueFilters = _.sortBy(uniqueFilters, function (uniqueFilter) {
			return uniqueFilter;
		});

		return sortedUniqueFilters;
	};

	var isIntersectedDataItem = function isIntersectedDataItem(checkedItems, dataItem) {
		var intersection = _.intersection(checkedItems, dataItem.attributes);
		return intersection.length === checkedItems.length;
	};

	var filterBoxChanged = function filterBoxChanged(changeEvent, settings) {
		var checkedFilters = [];
		var filteredData = [];
		var $clickedFilter = $(changeEvent.currentTarget);
		var $labels = $('#filters label');
		var $checkedFilters = $labels.has('input:checked');
		var clickedFilterLabelText = $clickedFilter.closest('label').text().trim().toLowerCase();
		var isClickedFilterActive = $clickedFilter.prop('checked');

		$labels.not('input:checked').removeClass('active');
		$checkedFilters.addClass('active');

		$checkedFilters.each(function (index, filterItem) {
			checkedFilters.push(filterItem.innerText);
		});

		_.each(filterData, function (dataItem) {
			if (isIntersectedDataItem(checkedFilters, dataItem)) {
				filteredData.push(dataItem);
			}
		});

		windowShade.cycle(250, 2000);

		var filterSettings = {
			items: filteredData,
			length: filteredData.length
		};

		$('#results-display').trigger('bcpl.filter.changed', filterSettings).fadeOut(250, function () {
			render(filterSettings, $('#results-display-template'), $('#results-display'), clickedFilterLabelText, isClickedFilterActive);
		});
	};

	var filterDataSuccess = function filterDataSuccess(contentData) {
		filterData = typeof contentData === 'string' ? JSON.parse(contentData) : contentData;

		render({
			items: filterData,
			length: filterData.length
		}, $('#results-display-template'), $('#results-display'));

		var filters = generateFiltersList(filterData);

		render(filters, $('#filters-template'), $('#filters'));
	};

	var filterDataError = function filterDataError(jqxhr, status, errorThrown) {
		console.log('err', errorThrown); // eslint-disable-line no-console
	};

	var filtersShowing = function filtersShowing(collapseEvent) {
		$(collapseEvent.currentTarget).siblings('.collapse-control').html('<i class="fa fa-minus"></i> Hide Filters');
	};

	var filtersHiding = function filtersHiding(collapseEvent) {
		$(collapseEvent.currentTarget).siblings('.collapse-control').html('<i class="fa fa-plus"></i> Show Filters');
	};

	var tagClicked = function tagClicked(clickEvent) {
		var $target = $(clickEvent.currentTarget);
		var tagText = $target.text().trim().toLowerCase();
		var $filterInputLabels = $('#filters label');

		$filterInputLabels.each(function (index, labelElement) {
			var $label = $(labelElement);

			if ($label.text().trim().toLowerCase() === tagText) {
				$label.find('input').trigger('click', { shouldClearFilters: true });
				$target.toggleClass('active');
			} else {
				$target.removeClass('active');
			}
		});
	};

	var init = function init(dataLoadingFunction) {
		dataLoadingFunction(filterDataSuccess, filterDataError);

		var filtersChangedEvent = document.createEvent('Event');
		filtersChangedEvent.initEvent('bcpl.filter.changed', true, true);

		$(document).on('click', '.tag-list button', tagClicked).on('change', '#filters input', filterBoxChanged).on('show.bs.collapse', '#filters', filtersShowing).on('hide.bs.collapse', '#filters', filtersHiding);
	};

	return { init: init };
}(jQuery, bcpl.utility.windowShade);
'use strict';

namespacer('bcpl');

bcpl.navigationSearch = function ($) {
	var navAndSearchContainerSelector = '.nav-and-search';
	var searchButtonActivatorSelector = '#activate-search-button';
	var searchBoxSelector = '#search-box';
	var searchButtonSelector = '#search-button';
	var searchButtonContainerSelector = '.search-button-container';
	var hamburgerButtonSelector = '#hamburger-menu-button';
	var menuSelector = '#responsive-sliding-navigation';
	var navBackButtonSelector = '#responsive-sliding-navigation > .nav-back-button button';
	var navItemSelector = '#responsive-sliding-navigation li';
	var modalCoverSelector = '#modal-cover';
	var headerSelector = 'header';
	var heroCalloutContainerSelector = '.hero-callout-container';
	var mobileWidthThreshold = 768;

	/* Helpers */

	var isMobileWidth = function isMobileWidth($element, threshold) {
		return parseFloat($element.width()) <= threshold;
	};

	var killMenuAndModalCover = function killMenuAndModalCover($menu, $modalCover) {
		$modalCover.removeClass('active');
		$menu.removeClass('active');
		$('#responsive-sliding-navigation .active').removeClass('active');
		$('body').removeClass('nav-visible');
	};

	/* Event Handlers */

	/**
  * Click event handler for the hamburger button.
  */
	var hamburgerButtonClicked = function hamburgerButtonClicked(event) {
		var $header = $(headerSelector);
		var $searchBox = event.data.$searchBox;
		var $menu = event.data.$menu;
		var $hamburgerButton = $(event.currentTarget);
		var $modalCover = event.data.$modalCover;

		$header.first().trigger('click');
		$searchBox.removeClass('active');
		$hamburgerButton.addClass('active');
		$menu.addClass('active');
		$modalCover.addClass('active');
		$('body').addClass('nav-visible');
	};

	var hideHeroCallout = function hideHeroCallout(shouldHide) {
		if (shouldHide && !isMobileWidth($('body'), mobileWidthThreshold)) {
			$(heroCalloutContainerSelector).hide();
		} else {
			$(heroCalloutContainerSelector).show();
		}
	};

	var onDocumentClick = function onDocumentClick(clickEvent) {
		var $target = $(clickEvent.target);
		var isTargetSearchButtonContainer = $target.closest(searchButtonContainerSelector).length;
		var isTargetSearchButton = $target.closest(searchBoxSelector).length;

		if (!isTargetSearchButton && !isTargetSearchButtonContainer) {
			if ($(searchBoxSelector).is(':visible')) {
				$(searchButtonActivatorSelector).trigger('click');
			}
		}
	};

	/**
  * Click event handler for the search activator button.
  */
	var searchButtonActivatorClicked = function searchButtonActivatorClicked(event) {
		var $navAndSearchContainerSelector = event.data.$navAndSearchContainerSelector;
		var $searchBox = event.data.$searchBox;
		var $searchButtonActivator = event.data.$searchButtonActivator;
		var $hamburgerButton = event.data.$hamburgerButton;
		var isSearchBoxHidden = $searchBox.is(':hidden');

		hideHeroCallout(isSearchBoxHidden);

		var $targetSearchElements = $searchButtonActivator.add($searchBox);

		if (isSearchBoxHidden) {
			$targetSearchElements.addClass('active');
			$navAndSearchContainerSelector.addClass('search-is-active');
			$hamburgerButton.add(navItemSelector).removeClass('active');
		} else {
			$targetSearchElements.removeClass('active');
			$navAndSearchContainerSelector.removeClass('search-is-active');
			$hamburgerButton.addClass('active');
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
		var $activeMenuItem = $('#responsive-sliding-navigation .active');

		if ($activeMenuItem.length) {
			$activeMenuItem.find('.submenu-wrapper').animate({ right: '-300px' }, 250, function afterAnimation() {
				$(this).closest('li.active').removeClass('active').closest('ul').removeClass('sub-menu');
			});
		} else {
			killMenuAndModalCover($menu, $modalCover);
		}
	};

	var resizeTimer = void 0;

	var windowResized = function windowResized(event, callback) {
		var $menu = event.data.$menu;
		var $modalCover = event.data.$modalCover;

		if (parseFloat($('body').css('width')) > 768 && $menu.hasClass('animatable')) {
			killMenuAndModalCover($menu, $modalCover);
			$menu.removeClass('animatable');
		} else {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
			}
			resizeTimer = setTimeout(function () {
				$menu.addClass('animatable');
				if (callback && typeof callback === 'function') {
					callback();
				}
			}, 500);
		}
	};

	/**
  * Attach events and inject any event dependencies.
  */
	var init = function init() {
		var $navAndSearchContainerSelector = $(navAndSearchContainerSelector);
		var $searchButtonActivator = $(searchButtonActivatorSelector);
		var $searchBox = $(searchBoxSelector);
		var $searchButton = $(searchButtonSelector);
		var $hamburgerButton = $(hamburgerButtonSelector);
		var $menu = $(menuSelector);
		var $navBackButton = $(navBackButtonSelector);
		var $modalCover = $(modalCoverSelector);

		$searchButtonActivator.on('click', {
			$navAndSearchContainerSelector: $navAndSearchContainerSelector,
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

		$(document).on('click', onDocumentClick);

		$(window).on('resize', {
			$menu: $menu,
			$modalCover: $modalCover
		}, windowResized);

		if (parseFloat($('body').css('width')) <= mobileWidthThreshold) {
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
	var navButtonSelector = '.nav-and-search:not(.search-is-active) #responsive-sliding-navigation button';
	var closestMenuNodeSelector = '#responsive-sliding-navigation>ul>li';
	var searchArtifactsSelector = '#activate-search-button, #search-box';
	var heroCalloutContainerSelector = '.hero-callout-container';
	var activeLinksSelector = '.active, .clicked';
	var activeMenuButtonSelector = 'li.active button';
	var subMenuClass = 'sub-menu';
	var backButtonSelector = '.window-back';
	var mobileWidthThreshold = 768;

	var isMobileWidth = function isMobileWidth($element, threshold) {
		return parseFloat($element.width()) <= threshold;
	};

	var isSlideNavigationVisible = function isSlideNavigationVisible() {
		return $('body').hasClass('nav-visible');
	};

	var focusFirstActiveMenuLink = function focusFirstActiveMenuLink(callback) {
		$('#responsive-sliding-navigation li.active a').first().focus();

		if (typeof callback === 'function') {
			callback();
		}
	};

	var findClosestButtonToLink = function findClosestButtonToLink($link) {
		return $link.closest(closestMenuNodeSelector).find('button');
	};

	var afterSubmenuActivated = function afterSubmenuActivated(target, afterAnimationCallback) {
		$(target).find('ul').attr('aria-hidden', false);

		if (afterAnimationCallback && typeof afterAnimationCallback === 'function') {
			afterAnimationCallback();
		}
	};

	var activateSubmenu = function activateSubmenu($button, afterAnimationCallback) {
		var animationOptions = isSlideNavigationVisible() ? { right: '0px' } : {};
		var animationSpeed = isSlideNavigationVisible() ? 250 : 0;
		$button.attr('aria-expanded', true).closest('li').addClass('active').find('.submenu-wrapper').animate(animationOptions, animationSpeed, function afterAnimation() {
			afterSubmenuActivated(this, afterAnimationCallback);
		});
	};

	var afterSubmenuDeactivated = function afterSubmenuDeactivated(target, afterAnimationCallback) {
		$(target).siblings('button').attr('aria-expanded', false).closest('li').removeClass('active').attr('aria-hidden', true);

		if (afterAnimationCallback && typeof afterAnimationCallback === 'function') {
			afterAnimationCallback();
		}
	};

	var deactivateSubmenu = function deactivateSubmenu($button, afterAnimationCallback) {
		var animationOptions = isSlideNavigationVisible() ? { right: '-300px' } : {};
		var animationSpeed = isSlideNavigationVisible() ? 250 : 0;
		$button.siblings('.submenu-wrapper').animate(animationOptions, animationSpeed, function afterAnimation() {
			afterSubmenuDeactivated(this, afterAnimationCallback);
		});
	};

	var removeActiveClassFromAllButtons = function removeActiveClassFromAllButtons() {
		return deactivateSubmenu($('#responsive-sliding-navigation').find(activeMenuButtonSelector));
	};

	var hideSearchBox = function hideSearchBox() {
		return $(searchArtifactsSelector).removeClass('active');
	};

	var hideHeroCallout = function hideHeroCallout(shouldHide) {
		if (shouldHide && !isMobileWidth($('body'), mobileWidthThreshold)) {
			$(heroCalloutContainerSelector).hide();
		} else {
			$(heroCalloutContainerSelector).show();
		}
	};

	var navButtonClicked = function navButtonClicked(event) {
		if (window.innerWidth <= mobileWidthThreshold) {
			var $button = $(event.currentTarget);
			var wasActive = $button.closest('li').hasClass('active');
			var $closestMenu = $button.closest('ul');
			hideSearchBox();
			removeActiveClassFromAllButtons();
			if (!wasActive) {
				activateSubmenu($button);
				$closestMenu.addClass(subMenuClass);
			} else {
				deactivateSubmenu($button);
				$closestMenu.removeClass(subMenuClass);
			}
			hideHeroCallout(!wasActive);
		}
	};

	var navigationKeyPressed = function navigationKeyPressed(keyboardEvent) {
		var keyCode = keyboardEvent.which || keyboardEvent.keyCode;
		var $button = $(keyboardEvent.currentTarget).closest('#responsive-sliding-navigation').find(activeMenuButtonSelector);

		switch (keyCode) {
			case keyCodes.escape:
				deactivateSubmenu($button);
				$button.focus();
				hideHeroCallout(false);
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
			case keyCodes.enter:
				var $searchArtifactsSelector = $(searchArtifactsSelector);

				keyboardEvent.preventDefault();
				removeActiveClassFromAllButtons();
				activateSubmenu($button);
				$button.siblings('.submenu-wrapper').find('a:visible').first().focus();

				if ($searchArtifactsSelector.is(':visible')) {
					hideSearchBox();
				}
				break;
			default:
				break;
		}
	};

	var navigationMenuItemKeyPressed = function navigationMenuItemKeyPressed(keyboardEvent) {
		var keyCode = keyboardEvent.which || keyboardEvent.keyCode;
		var $link = $(keyboardEvent.currentTarget);
		var $allActiveLinks = $link.closest(activeLinksSelector).find('a:visible');
		var $button = findClosestButtonToLink($link);

		switch (keyCode) {
			case keyCodes.upArrow:
				keyboardEvent.preventDefault();
				if ($allActiveLinks.index($link) - 1 === -1) {
					$allActiveLinks.eq(0).focus();
				} else {
					$allActiveLinks.eq($allActiveLinks.index($link) - 1).focus();
				}
				break;
			case keyCodes.leftArrow:
				keyboardEvent.preventDefault();
				if ($link.closest(closestMenuNodeSelector).prev('li').length) {
					deactivateSubmenu($button, function () {
						activateSubmenu($link.closest(closestMenuNodeSelector).prev('li').find('button'));
						focusFirstActiveMenuLink();
					});
				}
				break;
			case keyCodes.downArrow:
				keyboardEvent.preventDefault();
				$allActiveLinks.eq($allActiveLinks.index($link) + 1).focus();
				break;
			case keyCodes.rightArrow:
				keyboardEvent.preventDefault();
				if ($link.closest(closestMenuNodeSelector).next('li').length) {
					deactivateSubmenu($button, function () {
						activateSubmenu($link.closest(closestMenuNodeSelector).next('li').find('button'));
						focusFirstActiveMenuLink();
					});
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

	var onBackButtonClicked = function onBackButtonClicked(clickEvent) {
		clickEvent.preventDefault();
		window.history.back();
	};

	var stopNavMouseOver = function stopNavMouseOver(targetTimeout) {
		clearTimeout(targetTimeout);
	};

	var mouseHoverDelay = void 0;

	var navigationMouseover = function navigationMouseover(mouseOverEvent) {
		if (window.window.innerWidth > mobileWidthThreshold) {
			stopNavMouseOver(mouseHoverDelay);

			mouseHoverDelay = setTimeout(function () {
				var $navItem = $(mouseOverEvent.target);
				$navItem.closest('li').siblings().removeClass('active').end().addClass('active');
				hideHeroCallout(true);
				hideSearchBox();
			}, 250);
		}
	};

	var navigationMouseleave = function navigationMouseleave(mouseEvent) {
		var isNextElementANavElement = $(mouseEvent.relatedTarget).closest('#responsive-sliding-navigation').length;

		if (!isNextElementANavElement && !isMobileWidth($('body'), mobileWidthThreshold)) {
			stopNavMouseOver(mouseHoverDelay);
			removeActiveClassFromAllButtons();
			hideHeroCallout(false);
		}
	};

	$(document).on('mouseover', '.nav-and-search:not(.search-is-active) #responsive-sliding-navigation button, #responsive-sliding-navigation .submenu-wrapper', navigationMouseover).on('mouseleave', '.nav-and-search:not(.search-is-active) #responsive-sliding-navigation button, #responsive-sliding-navigation .submenu-wrapper', navigationMouseleave).on('keydown', '#responsive-sliding-navigation button', navigationButtonKeyPressed).on('keydown', '#responsive-sliding-navigation', navigationKeyPressed).on('click', navButtonSelector, navButtonClicked).on('click', backButtonSelector, onBackButtonClicked).on('keydown', '#responsive-sliding-navigation a', navigationMenuItemKeyPressed);

}(jQuery, bcpl.constants.keyCodes);
'use strict';

namespacer('bcpl');

bcpl.relatedTopicsWidget = function ($) {
	var secondaryNavSelector = '.secondary-nav';
	var widgetSelector = '.related-topics-widget';

	var moveWidget = function moveWidget($widget) {
		return $(secondaryNavSelector).after($widget);
	};
	var showWidget = function showWidget($widget) {
		return $widget.removeClass('hidden');
	};

	// OnDocument Ready
	$(function () {
		var $widget = $(widgetSelector);

		if ($widget.length) {
			moveWidget($widget);
			showWidget($widget);
		}
	});
}(jQuery);
'use strict';

namespacer('bcpl');

bcpl.scrollToTop = function ($, window, _) {
	var backToTopButtonSelector = '#scroll-to-top';
	var bodyHtmlSelector = 'body, html';
	var scrollSpeed = 250;
	var fadingSpeed = 200;
	var topScrollPosition = 0;

	var scrollToTopHandler = function scrollToTopHandler() {
		$(bodyHtmlSelector).animate({
			scrollTop: topScrollPosition
		}, scrollSpeed);
	};

	var windowScrollHandler = function windowScrollHandler() {
		if (window.pageYOffset === 0) {
			$(backToTopButtonSelector).fadeOut(fadingSpeed);
		} else {
			$(backToTopButtonSelector).fadeIn(fadingSpeed);
		}
	};

	var init = function init() {
		$(document).on('click', backToTopButtonSelector, scrollToTopHandler);
		$(window).on('scroll', _.debounce(windowScrollHandler, 100));
	};

	return {
		init: init
	};
}(jQuery, window, _);

$(function () {
	return bcpl.scrollToTop.init();
});
'use strict';

namespacer('bcpl');

bcpl.siteSearch = function ($, window, constants) {
	var siteSearchTabSelector = '.search-button';
	var siteSearchInputSelector = '#site-search-input';
	var siteSearchSearchIconSelector = '.site-search-input-container .fa-search';
	var searchButtonCatalogSelector = '.search-button-catalog';
	var searchButtonEventsSelector = '.search-button-events';
	var searchButtonWebsiteSelector = '.search-button-website';
	var searchAction = {};

	var onSearchTabClick = function onSearchTabClick(clickEvent) {
		var $searchBtn = $(clickEvent.currentTarget).siblings().removeClass('active').end().addClass('active');
		var buttonCaption = $searchBtn.text().trim();

		$(siteSearchInputSelector).attr('placeholder', 'Search the ' + buttonCaption);
	};

	var onSearchCatalogClick = function onSearchCatalogClick() {
		searchAction.search = function () {
			return searchCatalog(window);
		};
	};

	var onSearchEventsClick = function onSearchEventsClick() {
		searchAction.search = function () {
			return searchEvents(window);
		};
	};

	var onSearchWebsiteClick = function onSearchWebsiteClick() {
		searchAction.search = function () {
			return searchWebsite(window);
		};
	};

	var onSearchIconClick = function onSearchIconClick() {
		var searchTerms = getSearchTerms();

		if (searchAction && searchAction.search && searchTerms.length) {
			searchAction.search();
		}
	};

	var onSiteSearchKeyup = function onSiteSearchKeyup(keyupEvent) {
		var keyCode = keyupEvent.which || keyupEvent.keyCode;

		if (keyCode === bcpl.constants.keyCodes.enter) {
			var searchTerms = getSearchTerms();

			if (searchAction && searchAction.search && searchTerms.length) {
				searchAction.search();
			}
		}
	};

	var searchCatalog = function searchCatalog(activeWindow) {
		var searchTerms = getSearchTerms();

		if (searchTerms.length) {
			var baseCatalogUrl = constants.baseCatalogUrl;
			var searchUrl = constants.search.urls.catalog;
			activeWindow.location.href = '' + baseCatalogUrl + searchUrl + searchTerms; // eslint-disable-line 			
		}
	};

	var searchEvents = function searchEvents(activeWindow) {
		var searchTerms = getSearchTerms();

		if (searchTerms.length) {
			var baseWebsiteUrl = constants.baseWebsiteUrl;
			var searchUrl = constants.search.urls.events;
			activeWindow.location.href = '' + baseWebsiteUrl + searchUrl + searchTerms; // eslint-disable-line 			
		}
	};

	var searchWebsite = function searchWebsite(activeWindow) {
		var searchTerms = getSearchTerms();

		if (searchTerms.length) {
			var baseWebsiteUrl = constants.baseWebsiteUrl;
			var searchUrl = constants.search.urls.website;
			activeWindow.location.href = '' + baseWebsiteUrl + searchUrl + searchTerms; // eslint-disable-line 			
		}
	};

	var getSearchTerms = function getSearchTerms() {
		var $searchBox = $(siteSearchInputSelector);
		var searchTerms = $searchBox.val() || '';
		var trimmedSearchTerms = searchTerms.trim();
		var encodedSearchTerms = encodeURIComponent(trimmedSearchTerms);

		return encodedSearchTerms;
	};

	$(document).on('click', siteSearchTabSelector, onSearchTabClick);
	$(document).on('click', siteSearchSearchIconSelector, onSearchIconClick);
	$(document).on('click', searchButtonCatalogSelector, onSearchCatalogClick);
	$(document).on('keyup', siteSearchInputSelector, onSiteSearchKeyup);
	$(document).on('click', searchButtonEventsSelector, onSearchEventsClick);
	$(document).on('click', searchButtonWebsiteSelector, onSearchWebsiteClick);

	// Initially set up the catalog search
	$(onSearchCatalogClick);

}(jQuery, window, bcpl.constants);
'use strict';

namespacer('bcpl');

bcpl.slideDownNav = function ($) {
	var slideDownButtonSelector = '.slide-down-nav-item[data-target]';
	var downArrowClass = 'fa-angle-down';
	var upArrowClass = 'fa-angle-up';
	var activeClass = 'active';
	var animatationInterval = 500;

	var deactivateSlideDownButton = function deactivateSlideDownButton($btns) {
		$btns.removeClass(activeClass).find('i').removeClass(upArrowClass).addClass(downArrowClass);
	};

	var onSlideDownButtonSelectorClick = function onSlideDownButtonSelectorClick(clickEvent) {
		clickEvent.preventDefault();
		var $slideDownButton = $(clickEvent.currentTarget);
		var targetElmId = $slideDownButton.data('target');
		var $targetElm = $('#' + targetElmId);
		var isTargetVisbile = $targetElm.is(':visible');

		if (isTargetVisbile) {
			$targetElm.slideUp(animatationInterval);

			deactivateSlideDownButton($slideDownButton);
		} else {
			$targetElm.siblings().slideUp(animatationInterval, function () {
				$targetElm.slideDown(animatationInterval);

				deactivateSlideDownButton($slideDownButton.siblings());

				$slideDownButton.addClass(activeClass).find('i').removeClass(downArrowClass).addClass(upArrowClass);
			});
		}
	};

	$(document).on('click', slideDownButtonSelector, onSlideDownButtonSelectorClick);
}(jQuery);
'use strict';

namespacer('bcpl');

bcpl.smartSideNav = function ($, urlComparer, window) {
	var navLinksSelector = '.secondary-nav nav ul li a';
	var activeWindow = window;

	var hrefReducer = function hrefReducer(newHref, char) {
		return newHref ? newHref.toLowerCase().split(char)[0] : '';
	};
	var getHrefWithout = function getHrefWithout(href, chars) {
		return chars.reduce(hrefReducer, href);
	};

	var compareNavLinks = function compareNavLinks(index, navLink) {
		var $navLink = $(navLink);
		var navLinkHref = $navLink.attr('href');

		$navLink.removeClass('active');

		if (navLinkHref) {
			var queryStringAndHashIdentifiers = ['?', '#'];
			var hrefWithoutQueryStringAndHash = getHrefWithout(navLinkHref, queryStringAndHashIdentifiers);
			var locationUrlWithoutQueryStringAndHash = getHrefWithout(activeWindow.location.href, queryStringAndHashIdentifiers);

			if (urlComparer.isSamePage(hrefWithoutQueryStringAndHash, locationUrlWithoutQueryStringAndHash)) {
				$navLink.addClass('active');
				return false;
			}
		}

		return true;
	};

	var init = function init(injectedWindow) {
		if (injectedWindow) {
			activeWindow = injectedWindow;
		}
	};

	var setCurrentPageLinkActive = function setCurrentPageLinkActive() {
		$(navLinksSelector).each(compareNavLinks);
	};

	return {
		init: init,
		setCurrentPageLinkActive: setCurrentPageLinkActive
	};
}(jQuery, bcpl.utility.urlComparer, window);

$(function () {
	bcpl.smartSideNav.init();
	bcpl.smartSideNav.setCurrentPageLinkActive();
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
		var $activatedTab = $tabs.eq(tabControlIndex);

		event.data.$tabControls.add($tabs).removeClass('active');
		$activatedTab.addClass('active');
		$targetTabControl.addClass('active').trigger('tabControlChanged').closest('ul').toggleClass('open');
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