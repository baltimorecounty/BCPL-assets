namespacer('bcpl');

bcpl.smartSideNav = (($, window) => {
	const navLinksSelector = '.secondary-nav nav ul li a';
	let activeWindow = window;

	const getHrefWithoutQueryString = (href) => {
		return href ? href.toLowerCase().split('?')[0] : undefined;
	};

	const compareNavLinks = (index, navLink) => {
		const $navLink = $(navLink);
		const navLinkHref = $navLink.attr('href');

		$navLink.removeClass('active');

		if (navLinkHref) {
			const hrefWithoutQueryString = getHrefWithoutQueryString(navLinkHref);
			const locationUrlWithoutQueryString = getHrefWithoutQueryString(activeWindow.location.href);

			if (locationUrlWithoutQueryString.endsWith(hrefWithoutQueryString)) {
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
})(jQuery, window);

$(() => {
	bcpl.smartSideNav.init();
	bcpl.smartSideNav.setCurrentPageLinkActive();
});