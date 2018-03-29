namespacer('bcpl');

bcpl.constants = {
	// baseApiUrl: 'http://oit226696:3100',
	baseApiUrl: 'https://testservices.bcpl.info',
	baseCatalogUrl: 'https://ils-test.bcpl.lib.md.us',
	baseWebsiteUrl: 'https://staging.bcpl.info',
	basePageUrl: '/dist',
	defaultDocument: 'index.html',
	keyCodes: {
		enter: 13,
		escape: 27,
		upArrow: 38,
		downArrow: 40,
		leftArrow: 37,
		rightArrow: 39,
		tab: 9,
		space: 32
	},
	breakpoints: {
		large: 1200,
		medium: 992,
		small: 768,
		xsmall: 480
	},
	search: {
		urls: {
			materialTypes: '/sebin/y/r/primaryMaterialType.json',
			catalog: '/polaris/view.aspx?keyword=',
			events: '/events-and-programs/list.html#!/?term=',
			website: '/search-results.html?term=',
			api: '/api/swiftype/site-search',
			trackClickThrough: '/api/swiftype/track'
		}
	},
	homepage: {
		urls: {
			flipper: '/sebin/y/d/homepage-flipper.json',
			events: '/api/evanced/signup/events'
		}
	},
	shared: {
		urls: {
			alerts: '/api/structured-content/alerts',
			alertNotification: '/api/structured-content/alerts-notification',
			bookCarousels: 'https://catalog.bcpl.lib.md.us/ContentXchange/APICarouselToolkit/1/CAROUSEL_ID/2'
		}
	},
	expressions: {
		justWordCharacters: /\w+/g
	}
};
