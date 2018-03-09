namespacer('bcpl');

bcpl.stylesheetSwapper = (($) => {
	const getLinkTagByHref = (href) => {
		if (!href || (typeof href === 'string' && !href.trim())) {
			return null;
		}

		const loweredHref = href.toLowerCase();

		// If multiple links have the same href, just use the last one
		// because of the cascading nature of css.
		const $targetLinkTag = $(`link[href="${loweredHref}"]`).last();

		return $targetLinkTag[0] || null;
	};

	const swapLinkHrefs = (targetHref, newHref) => {
		if ((!targetHref || !newHref) || (typeof targetHref !== 'string' || typeof newHref !== 'string')) {
			return null;
		}

		const firstLinkTag = getLinkTagByHref(targetHref);
		const secondLinkTag = getLinkTagByHref(newHref);

		if (firstLinkTag) {
			$(firstLinkTag).attr('href', newHref);
		}

		if (secondLinkTag) {
			$(secondLinkTag).attr('href', targetHref);
		}

		const linkTag = firstLinkTag || secondLinkTag;

		return linkTag;
	};

	return {
		/* test-code */
		getLinkTagByHref,
		/* end-test-code */
		swapLinkHrefs
	};
})(jQuery);
