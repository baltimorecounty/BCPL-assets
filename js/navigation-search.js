namespacer('bcpl');

bcpl.navigationSearch = (($) => {
	const searchButtonActivatorSelector = '#activate-search-button';
	const searchBoxSelector = '#search-box';
	const searchButtonSelector = '#search-button';
	const hamburgerButtonSelector = '#hamburger-menu-button';
	const menuSelector = '.nav-and-search nav';
	const navBackButtonSelector = '.nav-back-button button';
	const modalCoverSelector = '#modal-cover';
	const menuItemsSelector = '.nav-and-search nav > ul > li > button';
	const submenuBackButtonSelector = '.nav-and-search nav ul li ul li button';

	/* Helpers */

	const killMenuAndModalCover = ($menu, $modalCover) => {
		$modalCover.removeClass('active');
		$menu.removeClass('active');
		$menu.removeClass('move-left');
		$menu.find('.slide-in').removeClass('slide-in');
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

		$menu.find('.slide-in').removeClass('slide-in');
		$searchButtonActivator.removeClass('active');
		$searchBox.removeClass('active');
		$hamburgerButton.addClass('active');
		$menu.addClass('active');
		$modalCover.addClass('active');
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
		window.location = `${bcpl.constants.basePageUrl}/search.html?q=${searchTerms}&page=1&resultsPerPage=10`;
	};

	const navBackButtonClicked = (event) => {
		const $menu = event.data.$menu;
		const $modalCover = event.data.$modalCover;
		killMenuAndModalCover($menu, $modalCover);
	};

	const modalCoverClicked = (event) => {
		const $menu = event.data.$menu;
		const $modalCover = event.data.$modalCover;
		killMenuAndModalCover($menu, $modalCover);
	};

	const menuItemClicked = (event) => {
		const $menuItem = $(event.currentTarget);
		const $submenu = $menuItem.siblings('ul');
		const $menu = event.data.$menu;

		$menu.find('.slide-in').removeClass('slide-in');
		$menu.addClass('move-left');
		$submenu.addClass('slide-in');
	};

	const submenuBackButtonClicked = (event) => {
		const $backButton = $(event.currentTarget);
		$backButton.closest('.slide-in').removeClass('slide-in');
		$backButton.closest('.move-left').removeClass('move-left');
	};

	let resizeTimer;

	const windowResized = (event) => {
		const $menu = event.data.$menu;
		const $modalCover = event.data.$modalCover;

		if (parseFloat($('body').css('width')) > 768 && $menu.hasClass('animatable')) {
			killMenuAndModalCover($menu, $modalCover);
			$menu.removeClass('animatable');
		} else {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				$menu.addClass('animatable');
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
		const $menuItems = $(menuItemsSelector);
		const $submenuBackButton = $(submenuBackButtonSelector);

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

		$searchButton.on('click', searchButtonClicked);

		$navBackButton.on('click', {
			$menu,
			$modalCover
		}, navBackButtonClicked);

		$modalCover.on('click', {
			$menu,
			$modalCover
		}, modalCoverClicked);

		$menuItems.on('click', { $menu }, menuItemClicked);

		$submenuBackButton.on('click', submenuBackButtonClicked);

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
		navBackButtonClicked,
		modalCoverClicked,
		menuItemClicked,
		submenuBackButtonClicked,
		windowResized,
		/* end-test-code */
		init
	};
})(jQuery);

$(() => {
	bcpl.navigationSearch.init();
});
