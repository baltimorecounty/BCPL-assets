namespacer('bcpl');

// requires bootstrap.js to be included in the page
bcpl.boostrapCollapseHelper = (($) => {
	const toggleCollapseByIds = (ids) => {
		ids.forEach(id => {
			$(`#${id}`).collapse('show');
		});
	};

	return {
		toggleCollapseByIds
	};
})(jQuery);
