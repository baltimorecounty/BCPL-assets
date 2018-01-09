namespacer('bcpl');

bcpl.constants = {
	baseApiUrl: 'https://testservices.bcpl.info',
	// baseApiUrl: 'http://ba224964:3100',
	basePageUrl: '/dist',
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
	search: {
		urls: {
			materialTypes: '/sebin/y/r/primaryMaterialType.json'
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
			alertNotification: '/api/structured-content/alerts-notification'
		}
	}
};
