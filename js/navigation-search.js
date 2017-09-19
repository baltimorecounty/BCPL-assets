namespacer('bcpl');

bcpl.navigationSearch = (($) => {
	const searchButtonActivatorSelector = '#activate-search-button';
	const searchBoxSelector = '#search-box';
	const searchButtonSelector = '#search-button';
	const hamburgerButtonSelector = '#hamburger-menu-button';
	const menuSelector = '.nav-and-search nav';
	const navBackButtonSelector = '.nav-back-button button';
	const modalCoverSelector = '#modal-cover';

	const hamburgerButtonClicked = (event) => {
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $menu = event.data.$menu;
		const $hamburgerButton = $(event.currentTarget);
		const $modalCover = event.data.$modalCover;

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

	const killMenuAndModalCover = ($menu, $modalCover) => {
		$modalCover.removeClass('active');
		$menu.removeClass('active');
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
			$menu,
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
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.navigationSearch.init();
});
