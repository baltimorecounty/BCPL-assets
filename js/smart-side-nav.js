namespacer('bcpl');

bcpl.smartSideNav = (($, urlComparer, window) => {
	const navLinksSelector = '.secondary-nav nav ul li a';
	let activeWindow = window;

	const getHrefWithout = (href, chars) => chars.reduce((newHref, char) => {
		return newHref
			? newHref.toLowerCase().split(char)[0]
			: undefined;
	}, href);

	const compareNavLinks = (index, navLink) => {
		const $navLink = $(navLink);
		const navLinkHref = $navLink.attr('href');

		$navLink.removeClass('active');

		if (navLinkHref) {
			const queryStringAndHashIdentifiers = ['?', '#'];
			const hrefWithoutQueryStringAndHash = getHrefWithout(navLinkHref, queryStringAndHashIdentifiers);
			const locationUrlWithoutQueryStringAndHash = getHrefWithout(activeWindow.location.href, queryStringAndHashIdentifiers);

			if (urlComparer.isSamePage(hrefWithoutQueryStringAndHash, locationUrlWithoutQueryStringAndHash)) {
				$navLink.addClass('active');
				return false;
			}
		}

		return true;
	};

	const init = (injectedWindow) => {
		if (injectedWindow) {
			activeWindow = injectedWindow;
		}
	};

	const setCurrentPageLinkActive = () => {
		$(navLinksSelector).each(compareNavLinks);
	};

	return {
		/* test-code */
		getHrefWithoutQueryString,
		compareNavLinks,
		/* end-test-code */
		init,
		setCurrentPageLinkActive
	};
})(jQuery, bcpl.utility.urlComparer, window);

$(() => {
	bcpl.smartSideNav.init();
	bcpl.smartSideNav.setCurrentPageLinkActive();
});
