namespacer('bcpl');

bcpl.navigationSearch = (($) => {
	const searchButtonActivatorSelector = '#activate-search-button';
	const searchBoxSelector = '#search-box';
	const searchButtonSelector = '#search-button';
	const menuSelector = '.nav-and-search nav';

	/**
	 * Attach events and inject any event dependencies.
	 */
	const init = () => {
		const $searchButtonActivator = $(searchButtonActivatorSelector);
		const $searchBox = $(searchBoxSelector);
		const $searchButton = $(searchButtonSelector);
		const $menu = $(menuSelector);

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
	const searchButtonActivatorClicked = event => {
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $menu = event.data.$menu;

		$searchButtonActivator.toggleClass('active');
		$searchBox.toggleClass('active');
		$menu.toggleClass('hidden-xs');
		
	};

	/**
	 * Click event handler for the search button.
	 */
	const searchButtonClicked = event => {

	};

	return { init };

})(jQuery);

$(() => {
	bcpl.navigationSearch.init();
});