namespacer('bcpl');

bcpl.accordion = (($) => {
	const accordionIconSelector = 'h1:first-child a i, h2:first-child a i, h3:first-child a i, h4:first-child a i, p:first-child a i';
	const collapsableSelector = '.content-accordion-body';
	const panelSelector = '.content-accordion .panel';

	const onCollapsableShown = (collapseEvent) => {
		const $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton
			.closest(panelSelector)
			.find(accordionIconSelector)
			.removeClass('fa-chevron-right')
			.addClass('fa-chevron-down');
	};

	const onCollapsableHidden = (collapseEvent) => {
		const $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton
			.closest(panelSelector)
			.find(accordionIconSelector)
			.removeClass('fa-chevron-down')
			.addClass('fa-chevron-right');
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
