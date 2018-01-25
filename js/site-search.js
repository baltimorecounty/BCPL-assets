namespacer('bcpl');

bcpl.siteSearch = (($) => {
	const siteSearchTabSelector = '.search-button';
	const siteSearchInputSelector = '#site-search-input';
	const siteSearchClearIconSelector = '.site-search-input-container .fa-times';
	const siteSearchSearchIconSelector = '.site-search-input-container .fa-search';

	const onSearchTabClick = (clickEvent) => {
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
		let $elmToHide = $(siteSearchSearchIconSelector);
		let $elmToShow = $(siteSearchClearIconSelector);

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
})(jQuery);
