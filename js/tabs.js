namespacer('bcpl');

bcpl.tabs = (($, undefined) => {

	const tabContainerSelector = '.tabs';
	const tabControlSelector = '.tab-control';
	const tabSelector = '.tab';

	const init = () => {
		const $tabContainer = $(tabContainerSelector);
		const $tabControls = $tabContainer.find(tabControlSelector);

		$tabControls.on('click', { 
			$tabContainer: $tabContainer,
			$tabControls: $tabControls 
		}, tabControlClicked);
	};

	const tabControlClicked = event => {
		const $targetTabControl = $(event.currentTarget);
		const $tabs = event.data.$tabContainer.find(tabSelector);
		const tabControlIndex = $targetTabControl.index();

		event.data.$tabControls.removeClass('active');
		$tabs.removeClass('active');
		$targetTabControl.addClass('active');
		$tabs.eq(tabControlIndex).addClass('active');
	};

	return { init };

})(jQuery);

$(() => {
	bcpl.tabs.init();
});