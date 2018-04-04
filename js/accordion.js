namespacer('bcpl');

bcpl.accordion = (($) => {
	const accordionIconSelector = 'h1:first-child a i, h2:first-child a i, h3:first-child a i, h4:first-child a i, p:first-child a i';
	const collapsableSelector = '.content-accordion-body';
	const panelSelector = '.content-accordion .panel';
	const collapseSelector = '.collapse';
	const htmlBodySelector = 'html, body';
	const anchorNameRegex = /^#[\w-]+$/;

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
	 * Scroll to the selected anchor.
	 * @param {HTMLElement} anchor Anchor we're scrolling to.
	 */
	const scrollToAnchor = $anchor => {
		$(htmlBodySelector).animate({
			scrollTop: $anchor.first().offset().top
		}, 250);
	};

	/**
	 * If a named anchor exists in a panel, and the location has a matching hash,
	 * open it, and scroll to it.
	 */
	const openPanelFromUrl = () => {
		const anchorIdentifier = window.location.hash;

		if (anchorIdentifier && anchorIdentifier.length && anchorNameRegex.test(anchorIdentifier)) {
			const $anchor = $(`a[name=${anchorIdentifier.replace('#', '')}]`);

			if (!$anchor.length) return;

			$anchor
				.closest(collapseSelector)
				.collapse('show')
				.on('shown.bs.collapse', () => scrollToAnchor($anchor));
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
