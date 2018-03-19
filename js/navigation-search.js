namespacer('bcpl');

bcpl.navigationSearch = (($) => {
	const navAndSearchContainerSelector = '.nav-and-search';
	const searchButtonActivatorSelector = '#activate-search-button';
	const searchBoxSelector = '#search-box';
	const searchButtonSelector = '#search-button';
	const searchButtonContainerSelector = '.search-button-container';
	const hamburgerButtonSelector = '#hamburger-menu-button';
	const menuSelector = '#responsive-sliding-navigation';
	const navBackButtonSelector = '#responsive-sliding-navigation > .nav-back-button button';
	const navItemSelector = '#responsive-sliding-navigation li';
	const modalCoverSelector = '#modal-cover';
	const headerSelector = 'header';
	const heroCalloutContainerSelector = '.hero-callout-container';
	const mobileWidthThreshold = 768;

	/* Helpers */

	const isMobileWidth = ($element, threshold) => parseFloat($element.width()) <= threshold;

	const killMenuAndModalCover = ($menu, $modalCover) => {
		$modalCover.removeClass('active');
		$menu.removeClass('active');
		$('#responsive-sliding-navigation .active').removeClass('active');
		$('body').removeClass('nav-visible');
	};

	/* Event Handlers */

	/**
	 * Click event handler for the hamburger button.
	 */
	const hamburgerButtonClicked = (event) => {
		const $header = $(headerSelector);
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $menu = event.data.$menu;
		const $hamburgerButton = $(event.currentTarget);
		const $modalCover = event.data.$modalCover;

		$header.first().trigger('click');
		$searchBox.removeClass('active');
		$hamburgerButton.addClass('active');
		$menu.addClass('active');
		$modalCover.addClass('active');
		$('body').addClass('nav-visible');
	};

	const hideHeroCallout = (shouldHide) => {
		if (shouldHide && !isMobileWidth($('body'), mobileWidthThreshold)) {
			$(heroCalloutContainerSelector).hide();
		} else {
			$(heroCalloutContainerSelector).show();
		}
	};

	const onDocumentClick = (clickEvent) => {
		const $target = $(clickEvent.target);
		const isTargetSearchButtonContainer = $target.closest(searchButtonContainerSelector).length;
		const isTargetSearchButton = $target.closest(searchBoxSelector).length;

		if (!isTargetSearchButton && !isTargetSearchButtonContainer) {
			if ($(searchBoxSelector).is(':visible')) {
				$(searchButtonActivatorSelector).trigger('click');
			}
		}
	};

	/**
	 * Click event handler for the search activator button.
	 */
	const searchButtonActivatorClicked = (event) => {
		const $navAndSearchContainerSelector = event.data.$navAndSearchContainerSelector;
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $hamburgerButton = event.data.$hamburgerButton;
		const isSearchBoxHidden = $searchBox.is(':hidden');

		hideHeroCallout(isSearchBoxHidden);

		const $targetSearchElements = $searchButtonActivator
			.add($searchBox);

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
	const searchButtonClicked = (event) => {
		const searchTerms = $(event.currentTarget).siblings('input').first().val();
		const browserWindow = event.data.browserWindow;
		browserWindow.location = `${bcpl.constants.basePageUrl}/search.html?q=${searchTerms}&page=1&resultsPerPage=10`;
	};

	/**
	 * Handler for events that dismiss the menu and modal
	 * @param {Event} event
	 */
	const modalDismissActionHandler = (event) => {
		const $menu = event.data.$menu;
		const $modalCover = event.data.$modalCover;
		const $activeMenuItem = $('#responsive-sliding-navigation .active');

		if ($activeMenuItem.length) {
			$activeMenuItem.find('.submenu-wrapper')
				.animate({ right: '-300px' }, 250, function afterAnimation() {
					$(this)
						.closest('li.active')
						.removeClass('active')
						.closest('ul')
						.removeClass('sub-menu');
				});
		} else {
			killMenuAndModalCover($menu, $modalCover);
		}
	};

	let resizeTimer;

	const windowResized = (event, callback) => {
		const $menu = event.data.$menu;
		const $modalCover = event.data.$modalCover;

		if (parseFloat($('body').css('width')) > 768 && $menu.hasClass('animatable')) {
			killMenuAndModalCover($menu, $modalCover);
			$menu.removeClass('animatable');
		} else {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
			}
			resizeTimer = setTimeout(() => {
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
	const init = () => {
		const $navAndSearchContainerSelector = $(navAndSearchContainerSelector);
		const $searchButtonActivator = $(searchButtonActivatorSelector);
		const $searchBox = $(searchBoxSelector);
		const $searchButton = $(searchButtonSelector);
		const $hamburgerButton = $(hamburgerButtonSelector);
		const $menu = $(menuSelector);
		const $navBackButton = $(navBackButtonSelector);
		const $modalCover = $(modalCoverSelector);

		$searchButtonActivator.on('click', {
			$navAndSearchContainerSelector,
			$searchBox,
			$searchButtonActivator,
			$hamburgerButton
		}, searchButtonActivatorClicked);

		$hamburgerButton.on('click', {
			$searchBox,
			$searchButtonActivator,
			$menu,
			$modalCover
		}, hamburgerButtonClicked);

		$searchButton.on('click', {
			browserWindow: window
		}, searchButtonClicked);

		$navBackButton.on('click', {
			$menu,
			$modalCover
		}, modalDismissActionHandler);

		$modalCover.on('click', {
			$menu,
			$modalCover
		}, modalDismissActionHandler);

		$(document).on('click', onDocumentClick);

		$(window).on('resize', {
			$menu,
			$modalCover
		}, windowResized);

		if (parseFloat($('body').css('width')) <= mobileWidthThreshold) {
			$menu.addClass('animatable');
		}
	};

	return {
		/* test-code */
		killMenuAndModalCover,
		hamburgerButtonClicked,
		searchButtonActivatorClicked,
		searchButtonClicked,
		modalDismissActionHandler,
		windowResized,
		/* end-test-code */
		init
	};
})(jQuery);

$(() => {
	bcpl.navigationSearch.init();
});
