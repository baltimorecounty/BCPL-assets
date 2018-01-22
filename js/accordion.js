namespacer('bcpl');

bcpl.accordion = (($) => {
	const accordionSelector = '.content-accordion';
	const accordionIcorSelector = 'h4 a i';
	const collapsableSelector = '.content-accordion-body';
	const panelSelector = '.content-accordion .panel';

	const onCollapsableShown = (collapseEvent) => {
		const $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton
			.closest(panelSelector)
			.find(accordionIcorSelector)
			.removeClass('fa-plus')
			.addClass('fa-minus');
	};

	const onCollapsableHidden = (collapseEvent) => {
		const $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton
			.closest(panelSelector)
			.find(accordionIcorSelector)
			.removeClass('fa-minus')
			.addClass('fa-plus');
	};

	const init = () => {
		$(document).on('show.bs.collapse', collapsableSelector, onCollapsableShown);
		$(document).on('hide.bs.collapse', collapsableSelector, onCollapsableHidden);
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.accordion.init();
});
