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
	var eventsService = function eventsService(CONSTANTS, $http, querystringService) {
		var get = function get(eventRequestModel, successCallback, errorCallback) {
			var querystring = querystringService.build(eventRequestModel);

			$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel).then(successCallback, errorCallback);
		};

		return {
			get: get
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', 'querystringService'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDataFormattingService = function eventDataFormattingService() {
		var formatSchedule = function formatSchedule(eventStart, eventLength) {
			if (!eventStart || Number.isNaN(Date.parse(eventStart))) {
				return 'Bad start date format';
			}

			if (typeof eventLength !== 'number' || eventLength <= 0) {
				return 'Bad event length format';
			}

			var eventStartDate = new Date(eventStart);
			var eventEndDate = new Date(eventStart);
			eventEndDate.setMinutes(eventStartDate.getMinutes() + eventLength);

			var startHour = get12HourValue(eventStartDate);
			var startMinutes = getMinuteString(eventStartDate.getMinutes());
			var startAmPm = getAmPm(eventStartDate);
			var endHour = get12HourValue(eventEndDate);
			var endMinutes = getMinuteString(eventEndDate.getMinutes());
			var endAmPm = getAmPm(eventEndDate);

			return startHour + ':' + startMinutes + ' ' + startAmPm + ' to ' + endHour + ':' + endMinutes + ' ' + endAmPm;
		};

		var get12HourValue = function get12HourValue(date) {
			var rawHours = date.getHours();

			if (rawHours === 0) return 12;

			if (rawHours <= 12) return rawHours;

			return rawHours - 12;
		};

		var getAmPm = function getAmPm(date) {
			return date.getHours() < 12 ? 'a.m.' : 'p.m.';
		};

		var getMinuteString = function getMinuteString(minutes) {
			return minutes < 10 ? '0' + minutes : '' + minutes;
		};

		return {
			formatSchedule: formatSchedule
		};
	};

	app.factory('eventDataFormattingService', eventDataFormattingService);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var querystringService = function querystringService() {
		var build = function build(querystringSettings) {
			if (!querystringSettings) {
				return '';
			}

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

	var EventsPageCtrl = function EventsPageCtrl($scope, $animate, $timeout, CONSTANTS, eventsService) {
		var self = this;

		var eventServiceRequestModel = {
			StartDate: '11/1/2017',
			EndDate: '11/30/2017',
			Limit: 25,
			Page: 1
		};

		eventsService.get(eventServiceRequestModel, function (response) {
			self.events = response.data;
		}, function () {});
	};

	EventsPageCtrl.$inject = ['$scope', '$animate', '$timeout', 'CONSTANTS', 'eventsService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDirective = function eventDirective(eventDataFormattingService) {
		var eventLink = function eventLink($scope) {
			var eventData = $scope.eventData;

			$scope.EventScheduleString = eventDataFormattingService.formatSchedule(eventData.EventStart, eventData.EventLength);
		};

		var directive = {
			restrict: 'E',
			templateUrl: '/dist/js/apps/events-page/templates/event.html',
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['eventDataFormattingService'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));