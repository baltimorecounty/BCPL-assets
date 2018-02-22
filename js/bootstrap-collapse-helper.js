namespacer('bcpl');

// requires bootstrap.js to be included in the page
bcpl.boostrapCollapseHelper = (($) => {
	const toggleCollapseById = (id) => {
		$(`#${id}`).collapse('toggle');
	};

	return {
		toggleCollapseById
	};

})(jQuery);