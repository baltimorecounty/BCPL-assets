namespacer('bcpl');

bcpl.smartSideNav = (($, window) => {
	const navLinksSelector = '.secondary-nav nav ul li a';

	const getHrefWithoutQueryString = (href) => {
		return href ? href.toLowerCase().split('?')[0] : undefined;
	};

	const compareNavLinks = (index, navLink) => {
		const $navLink = $(navLink);

		if (!$navLink.attr('href')) {
			$navLink.removeClass('active');
			return true;
		}

		const hrefWithoutQueryString = getHrefWithoutQueryString($navLink.attr('href'));
		const locationUrlWithoutQueryString = getHrefWithoutQueryString(window.location.href);

		if (locationUrlWithoutQueryString.endsWith(hrefWithoutQueryString)) {
			$navLink.addClass('active');
			return false;
		}

		$navLink.removeClass('active');
		return true;
	};

	const init = () => {
		const $allNavLinks = $(navLinksSelector);

		$allNavLinks.each(compareNavLinks);
	};

	return {
		/* test-code */
		getHrefWithoutQueryString,
		compareNavLinks,
		/* end-test-code */
		init
	};
})(jQuery, window);

$(() => bcpl.smartSideNav.init());

