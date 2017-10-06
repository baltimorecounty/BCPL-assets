namespacer('bcpl');

bcpl.navigationSearch = (($) => {
	const searchButtonActivatorSelector = '#activate-search-button';
	const searchBoxSelector = '#search-box';
	const searchButtonSelector = '#search-button';
	const hamburgerButtonSelector = '#hamburger-menu-button';
	const menuSelector = '#responsive-sliding-navigation';
	const navBackButtonSelector = '#responsive-sliding-navigation > .nav-back-button button';
	const modalCoverSelector = '#modal-cover';

	/* Helpers */

	const killMenuAndModalCover = ($menu, $modalCover) => {
		$modalCover.removeClass('active');
		$menu
			.removeClass('active');
		$('#responsive-sliding-navigation .active').removeClass('active');
		$('body').removeClass('nav-visible');
	};

	/* Event Handlers */

	/**
	 * Click event handler for the hamburger button.
	 */
	const hamburgerButtonClicked = (event) => {
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $menu = event.data.$menu;
		const $hamburgerButton = $(event.currentTarget);
		const $modalCover = event.data.$modalCover;

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
	const searchButtonActivatorClicked = (event) => {
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $hamburgerButton = event.data.$hamburgerButton;

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

		if ($('#responsive-sliding-navigation .active').length) {
			$('#responsive-sliding-navigation .active .submenu-wrapper')
				.animate({ right: '-300px' }, 250, function afterAnimation() {
					$(this)
						.closest('li.active')
						.removeClass('active');
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
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
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
	const init = () => {
		const $searchButtonActivator = $(searchButtonActivatorSelector);
		const $searchBox = $(searchBoxSelector);
		const $searchButton = $(searchButtonSelector);
		const $hamburgerButton = $(hamburgerButtonSelector);
		const $menu = $(menuSelector);
		const $navBackButton = $(navBackButtonSelector);
		const $modalCover = $(modalCoverSelector);

		$searchButtonActivator.on('click', {
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

		$(window).on('resize', {
			$menu,
			$modalCover
		}, windowResized);

		if (parseFloat($('body').css('width')) <= 768) {
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
