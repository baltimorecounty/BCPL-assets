// Requires Gtag from Google Analytics, requires includes polyfill

'use strict';

namespacer('bcpl.utility');

bcpl.utility.googleAnalytics = (() => {
	const googleEventKeys = {
		category: 'event_category',
		label: 'event_label',
		value: 'value'
	};
	const defaultGoogleEvents = {
		login: 'method',
		search: 'search_term',
		share: 'method',
		view_search_results: 'search_term'
	};
	const hasOwnProperty = (obj, propertyName) => !!obj && Object.prototype.hasOwnProperty.call(obj, propertyName);

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
			&& !isShareThisLink(linkElm)
			&& !isEmptyOrInvalidHref(linkElm.href);

	const isJavascriptStringRegex = /(https?:\/\/)?(javascript|return).*[:;\)]/i;

	const isEmptyOrInvalidHref = href => !href || isJavascriptStringRegex.test(href);

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

		gtag = hasOwnProperty(options, 'isDebug') && !!options.isDebug
			? console.log
			: window.gtag;

		validHostNames = options && hasOwnProperty(options, 'validHostNames')
			? options.validHostNames
			: validHostNames;

		addOutboundLinkTracking();
	};

	const getDefaultKey = (action) => hasOwnProperty(defaultGoogleEvents, action)
		? defaultGoogleEvents[action]
		: null;

	const getDefaultEvent = (event) => {
		const {
			action,
			label
		} = event;
		const defaultKey = getDefaultKey(action);

		return defaultKey ?
			{
				[defaultKey]: label
			} : null;
	};

	const getStandardEvent = (event) => {
		const {
			category,
			label,
			value
		} = event;
		const eventObj = {};

		if (category) {
			eventObj[googleEventKeys.category] = category;
		}
		if (label) {
			eventObj[googleEventKeys.label] = label;
		}
		if (value) {
			eventObj[googleEventKeys.value] = value;
		}

		return eventObj;
	};

	const getEventData = (event) => getDefaultEvent(event) || getStandardEvent(event);

	const trackEvent = (event) => {
		if (!event) return false;

		const eventData = getEventData(event);

		if (Object.keys(eventData).length > 0 && eventData.constructor === Object) {
			gtag('event', event.action, eventData);
		} else {
			gtag('event', event.action);
		}
	};

	const trackLogin = (loginType) => {
		const loginEvent = {
			action: 'login',
			label: loginType
		};

		trackEvent(loginEvent);
	};

	const trackSearch = (searchTerm) => {
		const searchEvent = {
			action: 'search',
			label: searchTerm
		};

		trackEvent(searchEvent);
	};

	const trackShare = (shareType) => {
		const shareEvent = {
			action: 'share',
			label: shareType
		};

		trackEvent(shareEvent);
	};

	const trackViewSearchResults = (searchTerm) => {
		const viewSearchResultsEvent = {
			action: 'view_search_results',
			label: searchTerm
		};

		trackEvent(viewSearchResultsEvent);
	};

	return {
		addOutboundLinkTracking,
		getDefaultEvent,
		getStandardEvent,
		handleExternalLinkClick,
		hasOwnProperty,
		init,
		isEmptyOrInvalidHref,
		isExternalLink,
		isShareThisLink,
		trackOutboundLink,
		trackEvent,
		trackLogin,
		trackSearch,
		trackShare,
		trackViewSearchResults
	};
})();
