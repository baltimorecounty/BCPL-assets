namespacer('bcpl');

bcpl.navigationSearch = (($) => {
	const searchButtonActivatorSelector = '#activate-search-button';
	const searchBoxSelector = '#search-box';
	const searchButtonSelector = '#search-button';
	const hamburgerButtonSelector = '#hamburger-menu-button';
	const menuSelector = '.nav-and-search nav';

	const hamburgerButtonClicked = (event) => {
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $menu = event.data.$menu;
		const $hamburgerButton = $(event.currentTarget);

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
	const searchButtonActivatorClicked = (event) => {
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $menu = event.data.$menu;
		const $hamburgerButton = event.data.$hamburgerButton;

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
	const searchButtonClicked = (event) => {

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

		$searchButtonActivator.on('click', {
			$searchBox,
			$searchButtonActivator,
			$menu,
			$hamburgerButton,
		}, searchButtonActivatorClicked);

		$hamburgerButton.on('click', {
			$searchBox,
			$searchButtonActivator,
			$menu,
		}, hamburgerButtonClicked);

		$searchButton.on('click', searchButtonClicked);
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.navigationSearch.init();
});
