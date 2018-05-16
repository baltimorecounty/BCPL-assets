// Requires Gtag from Google Analytics, requires includes polyfill

'use strict';

namespacer('bcpl.utility');

bcpl.utility.googleAnalytics = (() => {
	const hasOwnProperty = (obj, propertyName) => Object.prototype.hasOwnProperty.call(obj, propertyName);
	let gtag;
	let validHostNames = ['bcpl.info', 'bcpl.lib.md.us'];

	const addOutboundLinkTracking = () => {
		document.querySelector(document)
			.addEventListener('click', handleExternalLinkClick);
	};

	const handleExternalLinkClick = (clickEvent) => {
		const isTargetAnExternalLinkElm = isExternalLink(clickEvent.target);

		if (isTargetAnExternalLinkElm) {
			const linkHref = clickEvent.target
				&& hasOwnProperty(clickEvent.target, 'href');

			if (linkHref) {
				clickEvent.preventDefault();
				trackOutboundLink(clickEvent.target.href);
			}
		}
	};

	const isExternalLink = (linkElm) =>
		!!(linkElm
			&& hasOwnProperty(linkElm, 'hostname')
			&& linkElm.hostname
			&& linkElm.hostname !== window.location.hostname
			&& !isValidHostName(linkElm.hostname));

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

	const init = (options, ga) => {
		if (!ga) {
			console.error('Google Analytics Not Loaded'); // eslint-disable-line no-console
			return;
		}

		gtag = window.ga || ga;

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
