namespacer('bcpl');

// requires bootstrap.js to be included in the page
bcpl.boostrapCollapseHelper = (($) => {
	const toggleCollapseByIds = (panels) => {
		const { activePanels, inActivePanels } = panels;

		activePanels.forEach(id => {
			$(`#${id}`).collapse('show');
		});

		inActivePanels.forEach(id => {
			$(`#${id}`).collapse('hide');
		});
	};

	return {
		toggleCollapseByIds
	};
})(jQuery);
