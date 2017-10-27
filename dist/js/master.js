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
		var template = Handlebars.compile(source);
		var html = template(dataForTemplate);
		$target.html(html);

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

		/* if (shouldClearFilters) {
  	$labels.removeClass('active');
  	$labels.each((index, labelElement) => {
  		$(labelElement).find('input').prop('checked', false);
  	});
  } 
  		$clickedFilter.prop('checked', true);
  $clickedFilter.closest('label').addClass('active');
  */
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
	var searchButtonActivatorSelector = '#activate-search-button';
	var searchBoxSelector = '#search-box';
	var searchButtonSelector = '#search-button';
	var hamburgerButtonSelector = '#hamburger-menu-button';
	var menuSelector = '#responsive-sliding-navigation';
	var navBackButtonSelector = '#responsive-sliding-navigation > .nav-back-button button';
	var modalCoverSelector = '#modal-cover';

	/* Helpers */

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
			clearTimeout(resizeTimer);
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
		var $searchButtonActivator = $(searchButtonActivatorSelector);
		var $searchBox = $(searchBoxSelector);
		var $searchButton = $(searchButtonSelector);
		var $hamburgerButton = $(hamburgerButtonSelector);
		var $menu = $(menuSelector);
		var $navBackButton = $(navBackButtonSelector);
		var $modalCover = $(modalCoverSelector);

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
	var navButtonSelector = '#responsive-sliding-navigation button';
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
				keyboardEvent.preventDefault();
				removeActiveClassFromAllButtons();
				activateSubmenu($button);
				$button.siblings('.submenu-wrapper').find('a:visible').first().focus();
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

	var navigationMouseover = function navigationMouseover() {
		hideHeroCallout(true);
	};

	var navigationMouseleave = function navigationMouseleave(mouseEvent) {
		var isNextElementANavElement = $(mouseEvent.relatedTarget).closest('#responsive-sliding-navigation').length;

		if (!isNextElementANavElement && !isMobileWidth($('body'), mobileWidthThreshold)) {
			removeActiveClassFromAllButtons();
			hideHeroCallout(false);
		}
	};

	$(document).on('mouseover', '#responsive-sliding-navigation, #responsive-sliding-navigation *', navigationMouseover);
	$(document).on('mouseleave', '#responsive-sliding-navigation, #responsive-sliding-navigation *', navigationMouseleave);
	$(document).on('keydown', '#responsive-sliding-navigation button', navigationButtonKeyPressed);
	$(document).on('keydown', '#responsive-sliding-navigation', navigationKeyPressed);
	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('keydown', '#responsive-sliding-navigation a', navigationMenuItemKeyPressed);

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