namespacer('bcpl');

bcpl.stylesheetSwapper = (($, regexTools, browserStorage) => {
	/**
	 * Gets the <link> tag element by searching for one with the supplies href value.
	 * @param {string} href
	 */
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

	/**
	 * Conditionally adds or removes a <link> tag with the supplied regex.
	 * @param {string} href
	 * @param {string} sessionStorageKey
	 */
	const toggleStylesheet = (href, sessionStorageKey) => {
		const loweredHref = href.toLowerCase();

		const linkTag = getLinkTagByHref(loweredHref);

		if (linkTag && linkTag.parentElement) {
			browserStorage.session(sessionStorageKey, false);
			return linkTag.parentElement.removeChild(linkTag);
		}

		browserStorage.session(sessionStorageKey, true);
		return $('head').append(`<link href="${href}" rel="stylesheet">`)[0];
	};

	return {
		/* test-code */
		getLinkTagByHref,
		/* end-test-code */
		toggleStylesheet
	};
})(jQuery, bcpl.utility.regexTools, bcpl.utility.browserStorage);
