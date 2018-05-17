// Requires Gtag from Google Analytics, requires includes polyfill

'use strict';

namespacer('bcpl.utility');

bcpl.utility.googleAnalytics = (() => {
	const hasOwnProperty = (obj, propertyName) => Object.prototype.hasOwnProperty.call(obj, propertyName);
	let gtag;
	let validHostNames = ['bcpl.info', 'bcpl.lib.md.us'];

	const addOutboundLinkTracking = () => {
		document
			.addEventListener('click', handleExternalLinkClick);
	};

	const handleExternalLinkClick = (clickEvent) => {
		const targetElm = $(clickEvent.target).is('a')
			? clickEvent.target
			: $(clickEvent.target).closest('a')[0];

		const isTargetAnExternalLinkElm = isExternalLink(targetElm);

		if (isTargetAnExternalLinkElm) {
			const hasLinkHref = targetElm
				&& (hasOwnProperty(targetElm, 'href') || !!targetElm.href);

			if (hasLinkHref) {
				clickEvent.preventDefault();
				trackOutboundLink(targetElm.href);
			}
		}
	};

	const isExternalLink = (linkElm) =>
		!!(linkElm
			&& (hasOwnProperty(linkElm, 'hostname') || !!linkElm.hostname)
			&& linkElm.hostname
			&& linkElm.hostname !== window.location.hostname
			&& !isValidHostName(linkElm.hostname))
			&& !isShareThisLink(linkElm);

	const isShareThisLink = linkElm => linkElm.href && linkElm.href.indexOf('addthis') > -1;

	const isValidHostName = (linkHostName) =>
		!!(validHostNames
			.filter(validHostName => linkHostName.endsWith(validHostName))
			.length);

	// https://support.google.com/analytics/answer/7478520?hl=en
	const trackOutboundLink = (url) => {
		gtag('event', 'click', {
			event_category: 'outbound',
			event_label: url,
			transport_type: 'beacon',
			event_callback: () => {
				document.location = url;
			}
		});
	};

	const init = (options) => {
		if (!window.gtag) {
			console.error('Google Analytics Not Loaded'); // eslint-disable-line no-console
			return;
		}

		gtag = window.gtag;

		validHostNames = options && hasOwnProperty(options, 'validHostNames')
			? options.validHostNames
			: validHostNames;

		addOutboundLinkTracking();
	};

	return {
		addOutboundLinkTracking,
		handleExternalLinkClick,
		init,
		isExternalLink,
		trackOutboundLink
	};
})();
