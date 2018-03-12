namespacer('bcpl');

bcpl.stylesheetSwapper = (($) => {
	const getLinkTagByHref = (href) => {
		if (!href || (typeof href === 'string' && href.trim().length === 0)) {
			return null;
		}

		const loweredHref = href.toLowerCase();

		// If multiple links have the same href, just use the last one
		// because of the cascading nature of css.
		const $targetLinkTag = $(`link[rel=stylesheet][href~="${loweredHref}"]`);

		return $targetLinkTag[0] || null;
	};

	const toggleStylesheet = (href) => {
		const loweredHref = href.toLowerCase();

		const linkTag = getLinkTagByHref(loweredHref);

		if (linkTag && linkTag.parentElement) {
			return linkTag.parentElement.removeChild(linkTag);
		}

		return $('head').append(`<link href="${href}" rel="stylesheet">`)[0];
	};

	return {
		/* test-code */
		getLinkTagByHref,
		/* end-test-code */
		toggleStylesheet
	};
})(jQuery);
