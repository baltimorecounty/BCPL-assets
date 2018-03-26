namespacer('bcpl');

bcpl.accordion = (($) => {
	const accordionIconSelector = 'h1:first-child a i, h2:first-child a i, h3:first-child a i, h4:first-child a i, p:first-child a i';
	const collapsableSelector = '.content-accordion-body';
	const panelSelector = '.content-accordion .panel';
	const collapseSelector = '.collapse';
	const htmlBodySelector = 'html, body';

	/**
	 * Handles the collapseable "show" event.
	 * @param {Event} collapseEvent
	 */
	const onCollapsableShown = (collapseEvent) => {
		const $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton
			.closest(panelSelector)
			.find(accordionIconSelector)
			.removeClass('fa-chevron-right')
			.addClass('fa-chevron-down');
	};

	/**
	 * Handles the collapsable "hide" event.
	 * @param {Event} collapseEvent
	 */
	const onCollapsableHidden = (collapseEvent) => {
		const $collapseButton = $(collapseEvent.currentTarget);

		$collapseButton
			.closest(panelSelector)
			.find(accordionIconSelector)
			.removeClass('fa-chevron-down')
			.addClass('fa-chevron-right');
	};

	/**
	 * If a named anchor exists in a panel, and the location has a matching hash,
	 * open it, and scroll to it.
	 */
	const openPanelFromUrl = () => {
		const fragmentIdentifier = window.location.hash;

		if (fragmentIdentifier && fragmentIdentifier.length) {
			const $fragment = $(`a[name=${fragmentIdentifier.replace('#', '')}]`);

			if (!$fragment.length) return;

			$fragment
				.closest(collapseSelector)
				.collapse('show');

			$(htmlBodySelector).animate({
				scrollTop: $fragment.first().offset().top
			}, 250);
		}
	};

	const init = () => {
		$(document).on('show.bs.collapse', collapsableSelector, onCollapsableShown);
		$(document).on('hide.bs.collapse', collapsableSelector, onCollapsableHidden);

		openPanelFromUrl();
	};

	return { init };
})(jQuery);

$(() => {
	bcpl.accordion.init();
});
