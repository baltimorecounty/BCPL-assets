namespacer('bcpl');

bcpl.constants = {
    baseApiUrl: 'https://services.bcpl.info',
    baseCatalogUrl: 'https://catalog.bcpl.lib.md.us',
    baseWebsiteUrl: 'https://www.bcpl.info',
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
			searchTerms: '/api/polaris/searchterm'
        }
    },
    homepage: {
        urls: {
            flipper: '/sebin/y/d/homepage-flipper.json',
            events: '/api/evanced/signup/events'
        }
    },
    libAnswers: {
        allBranchIds: [6319, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874, 6875, 6876, 6877, 6878, 6879, 6777, 6880, 6881, 8845, 8846],
        generalBranchId: 7783
    },
    shared: {
        urls: {
            alerts: '/api/structured-content/alerts',
            alertNotification: '/api/structured-content/alerts-notification',
            bookCarousels: 'https://services.bcpl.info/api/polaris/carousel/CAROUSEL_ID'
        }
    },
    expressions: {
        justWordCharacters: /\w+/g
    }
};
