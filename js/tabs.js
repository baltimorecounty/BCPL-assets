namespacer('bcpl');

bcpl.tabs = (($) => {
	const tabContainerSelector = '.tabs';
	const tabControlSelector = '.tab-control';
	const tabSelector = '.tab';

	const tabControlClicked = (event) => {
		const $targetTabControl = $(event.currentTarget);
		const $tabs = event.data.$tabContainer.find(tabSelector);
		const tabControlIndex = $targetTabControl.index();
		const $activatedTab = $tabs.eq(tabControlIndex);

		event.data.$tabControls.removeClass('active');
		$tabs.removeClass('active');
		$activatedTab.addClass('active');
		$targetTabControl
			.addClass('active')
			.trigger('tabControlChanged')
			.closest('ul')
			.toggleClass('open');
	};

	const init = () => {
		const $tabContainer = $(tabContainerSelector);
		const $tabControls = $tabContainer.find(tabControlSelector);


		$tabControls.on('click', {
			$tabContainer,
			$tabControls
		}, tabControlClicked);
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.tabs.init();
});
