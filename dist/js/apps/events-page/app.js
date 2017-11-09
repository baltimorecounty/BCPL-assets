'use strict';

(function () {
	'use strict';

	angular.module('eventsPageApp', ['ngAnimate']);
})();
'use strict';

(function (app) {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://ba224964:3100',
		serviceUrls: {
			events: '/api/evanced/signup/events'
		}
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventsService = function eventsService(CONSTANTS, querystringService) {
		var get = function get(startDate, endDate, take, page, successCallback, errorCallback) {
			var querystringSettings = {
				startDate: startDate,
				endDate: endDate,
				take: take,
				page: page
			};

			var querystring = querystringService.build(querystringSettings);

			$.ajax(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events).done(successCallback).fail(errorCallback);
		};

		return {
			get: get
		};
	};

	eventsService.$inject = ['CONSTANTS', 'querystringService'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var querystringService = function querystringService() {
		var build = function build(querystringSettings) {
			var enumeratedProperties = Object.entries(querystringSettings);
			var propertyNameIndex = 0;
			var propertyValueIndex = 1;
			var querystring = '';

			if (enumeratedProperties.length) {
				angular.forEach(enumeratedProperties, function (property) {
					querystring += property[propertyNameIndex] + '=' + property[propertyValueIndex] + '&';
				});
			}

			return querystring;
		};

		return {
			build: build
		};
	};

	app.factory('querystringService', querystringService);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var EventsPageCtrl = function EventsPageCtrl($scope, $animate, $timeout, CONSTANTS) {
		var self = this;
	};

	EventsPageCtrl.$inject = ['$scope', '$animate', '$timeout', 'CONSTANTS'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));