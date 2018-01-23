namespacer('bcpl');

bcpl.siteSearch = (($) => {
	const siteSearchBtnSelector = '.search-button';
	const siteSearchInputSelector = '#site-search-input';
	const siteSearchClearIcon = '.site-search-input-container .fa-times';
	const siteSearchSearchIcon = '.site-search-input-container .fa-search';

	const onSearchBtnClick = (clickEvent) => {
		const $searchBtn = $(clickEvent.target);
		$searchBtn
			.siblings().removeClass('active').end()
			.addClass('active');
	};

	const onSearchClearBtnClick = () => {
		$(siteSearchInputSelector)
			.val('')
			.trigger('keyup')
			.focus();
	};

	const onSearchInputKeyup = (keyupEvent) => {
		const $searchInput = $(keyupEvent.target);
		const doesSearchHaveValue = $searchInput.val();
		let $elmToHide = $(siteSearchSearchIcon);
		let $elmToShow = $(siteSearchClearIcon);

		if (!doesSearchHaveValue) {
			$elmToHide = $(siteSearchClearIcon);
			$elmToShow = $(siteSearchSearchIcon);
		}

		$elmToHide.hide();
		$elmToShow.show();
	};

	const init = () => {
		$(document).on('click', siteSearchBtnSelector, onSearchBtnClick);
		$(document).on('click', siteSearchClearIcon, onSearchClearBtnClick);
		$(document).on('keyup', siteSearchInputSelector, onSearchInputKeyup);
	};

	return {
		init
	};
})(jQuery);

$(() => bcpl.siteSearch.init());
