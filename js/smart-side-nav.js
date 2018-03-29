namespacer('bcpl');

bcpl.smartSideNav = (($, urlComparer, window) => {
	const navLinksSelector = '.secondary-nav nav ul li a';
	let activeWindow = window;

    const hrefReducer = (newHref, char) => newHref ? newHref.toLowerCase().split(char)[0] : '';
	const getHrefWithout = (href, chars) => chars.reduce(hrefReducer, href);

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
