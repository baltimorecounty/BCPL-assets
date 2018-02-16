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

bcpl.utility.format = function () {
	'use strict';

	function formatCurrency(input) {
		if (!input) {
			return;
		}

		if (input && typeof input === 'string') {
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

bcpl.constants = {
	baseApiUrl: 'https://testservices.bcpl.info',
	// baseApiUrl: 'http://oit226696:3100',
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
	},
	breakpoints: {
		large: 1200,
		medium: 992,
		small: 768,
		xsmall: 480
	},
	search: {
		urls: {
			materialTypes: '/sebin/y/r/primaryMaterialType.json'
		}
	},
	homepage: {
		urls: {
			flipper: '/sebin/y/d/homepage-flipper.json',
			events: '/api/evanced/signup/events'
		}
	},
	shared: {
		urls: {
			alerts: '/api/structured-content/alerts',
			alertNotification: '/api/structured-content/alerts-notification',
			bookCarousels: 'https://catalog.bcpl.lib.md.us/ContentXchange/APICarouselToolkit/1/CAROUSEL_ID/2'
		}
	}
};
'use strict';

namespacer('bcpl');

bcpl.accordion = function ($) {
	var accordionIcorSelector = 'h4 a i';
	var collapsableSelector = '.content-accordion-body';
	var panelSelector = '.content-accordion .panel';

	var onCollapsableShown = function onCollapsableShown(collapseEvent) {
		var $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton.closest(panelSelector).find(accordionIcorSelector).removeClass('fa-chevron-right').addClass('fa-chevron-down');
	};

	var onCollapsableHidden = function onCollapsableHidden(collapseEvent) {
		var $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton.closest(panelSelector).find(accordionIcorSelector).removeClass('fa-chevron-down').addClass('fa-chevron-right');
	};

	var init = function init() {
		$(document).on('show.bs.collapse', collapsableSelector, onCollapsableShown);
		$(document).on('hide.bs.collapse', collapsableSelector, onCollapsableHidden);
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

	var loadData = function loadData(carouselId) {
		var url = constants.shared.urls.bookCarousels.replace('CAROUSEL_ID', carouselId);

		return $.ajax(url, {
			dataType: 'jsonp'
		}).then(function (data) {
			return onDataSuccess(data, carouselId);
		});
	};

	var onDataSuccess = function onDataSuccess(data, carouselId) {
		var $data = $(data.Carousel_Str);
		var $images = $data.find('li div img');
		var $links = $data.find('li div a');
		var $items = $data.find('li').map(function (index, element) {
			return cleanHtml(index, element, $images, $links);
		});

		$('.book-carousel[data-carousel-id=' + carouselId + ']').append($items.get());
	};

	var cleanHtml = function cleanHtml(index, element, $images, $links) {
		var $image = $images.eq(index);
		var $link = $links.eq(index);

		$image.attr('src', $image.attr('src').toLowerCase().replace('sc.gif', 'mc.gif')).attr('style', '');

		return $('<div class="inner"></div>').append($image).append($link);
	};

	var init = function init() {
		var maxSlides = void 0;

		$('.book-carousel').each(function (index, carouselElement) {
			var $carouselElement = $(carouselElement);
			var carouselId = $carouselElement.attr('data-carousel-id');
			maxSlides = parseInt($carouselElement.attr('data-max-slides'), 10);

			promises.push(loadData(carouselId));
		});

		$.when.apply($, promises).then(function () {
			if (!Number.isNaN(maxSlides) && maxSlides > 0) {
				slickSettings.slidesToShow = maxSlides;
			}

			$('.book-carousel').slick(slickSettings);
		});
	};

	return {
		init: init
	};
}(jQuery, bcpl.constants);
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
	var filtersChangedEvent = void 0;

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
		var shouldClearFilters = settings && settings.shouldClearFilters ? settings.shouldClearFilters : false;

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
		console.log('err', errorThrown);
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

		$(document).on('click', '.tag-list button', tagClicked);
		$(document).on('change', '#filters input', filterBoxChanged);
		$(document).on('show.bs.collapse', '#filters', filtersShowing);
		$(document).on('hide.bs.collapse', '#filters', filtersHiding);
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
		var $searchBox = event.data.$searchBox;
		var $searchButtonActivator = event.data.$searchButtonActivator;
		var $menu = event.data.$menu;
		var $hamburgerButton = $(event.currentTarget);
		var $modalCover = event.data.$modalCover;

		// $menu.find('.slide-in').removeClass('slide-in');
		$searchButtonActivator.removeClass('active');
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
				$(this).closest('li.active').removeClass('active');
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
	var mobileWidthThreshold = 768;

	var isMobileWidth = function isMobileWidth($element, threshold) {
		return parseFloat($element.width()) <= threshold;
	};

	var isSlideNavigationVisible = function isSlideNavigationVisible() {
		return $('body').hasClass('nav-visible');
	};

	var focusFirstActiveMenuLink = function focusFirstActiveMenuLink() {
		return $('#responsive-sliding-navigation li.active a').first().focus();
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
			hideSearchBox();
			removeActiveClassFromAllButtons();
			if (!wasActive) {
				activateSubmenu($button);
			} else {
				deactivateSubmenu($button);
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

	$(document).on('mouseover', '.nav-and-search:not(.search-is-active) #responsive-sliding-navigation button, #responsive-sliding-navigation .submenu-wrapper', navigationMouseover);
	$(document).on('mouseleave', '.nav-and-search:not(.search-is-active) #responsive-sliding-navigation button, #responsive-sliding-navigation .submenu-wrapper', navigationMouseleave);
	$(document).on('keydown', '#responsive-sliding-navigation button', navigationButtonKeyPressed);
	$(document).on('keydown', '#responsive-sliding-navigation', navigationKeyPressed);
	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('keydown', '#responsive-sliding-navigation a', navigationMenuItemKeyPressed);

}(jQuery, bcpl.constants.keyCodes);
'use strict';

namespacer('bcpl');

bcpl.scrollToTop = function ($) {
	var backToTopButtonSelector = '#scroll-to-top';
	var bodyHtmlSelector = 'body, html';
	var scrollSpeed = 250;
	var topScrollPosition = 0;

	var scrollToTopHandler = function scrollToTopHandler() {
		$(bodyHtmlSelector).animate({
			scrollTop: topScrollPosition
		}, scrollSpeed);
	};

	var init = function init() {
		$(document).on('click', backToTopButtonSelector, scrollToTopHandler);
	};

	return {
		init: init
	};
}(jQuery);

$(function () {
	return bcpl.scrollToTop.init();
});
'use strict';

namespacer('bcpl');

bcpl.siteSearch = function ($) {
	var siteSearchTabSelector = '.search-button';
	var siteSearchInputSelector = '#site-search-input';
	var siteSearchClearIconSelector = '.site-search-input-container .fa-times';
	var siteSearchSearchIconSelector = '.site-search-input-container .fa-search';

	var onSearchTabClick = function onSearchTabClick(clickEvent) {
		var $searchBtn = $(clickEvent.target);
		$searchBtn.siblings().removeClass('active').end().addClass('active');
	};

	var onSearchClearBtnClick = function onSearchClearBtnClick() {
		$(siteSearchInputSelector).val('').trigger('keyup').focus();
	};

	var onSearchInputKeyup = function onSearchInputKeyup(keyupEvent) {
		var $searchInput = $(keyupEvent.target);
		var doesSearchHaveValue = $searchInput.val();
		var $elmToHide = $(siteSearchSearchIconSelector);
		var $elmToShow = $(siteSearchClearIconSelector);

		if (!doesSearchHaveValue) {
			$elmToHide = $(siteSearchClearIconSelector);
			$elmToShow = $(siteSearchSearchIconSelector);
		}

		$elmToHide.hide();
		$elmToShow.show();
	};

	$(document).on('click', siteSearchTabSelector, onSearchTabClick);
	$(document).on('click', siteSearchClearIconSelector, onSearchClearBtnClick);
	$(document).on('keyup', siteSearchInputSelector, onSearchInputKeyup);
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