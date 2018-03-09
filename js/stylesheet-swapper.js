namespacer('bcpl');

bcpl.stylesheetSwapper = (() => {
	const getLinkTagByHref = (href) => {
		const linkTags = document.querySelectorAll('link');
		const linkTagArray = Array.prototype.slice.call(linkTags);
		const loweredHref = href.toLowerCase();

		const matches = linkTagArray.filter((tag) => {
			return tag.href.toLowerCase() === loweredHref;
		});

		if (matches.length) {
			// If multiple links have the same href, just use the last one
			// because of the cascading nature of css.
			return matches[matches.length - 1];
		}

		return null;
	};

	return {
		getLinkTagByHref
	};
})();
