'use strict';

(function () {
	'use strict';

	angular.module('eventsPageApp', []);
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
	var eventsService = function eventsService(CONSTANTS, $http, $q) {
		var isEventOnDate = function isEventOnDate(eventItem, eventDate) {
			var eventItemDate = new Date(eventItem.EventStart).toLocaleDateString();
			return eventItemDate === eventDate;
		};

		var dateSplitter = function dateSplitter(eventData) {
			var eventsByDate = [];
			var lastEventDate = void 0;

			angular.forEach(eventData, function (eventItem) {
				var eventDate = new Date(eventItem.EventStart).toLocaleDateString();

				if (lastEventDate !== eventDate) {
					eventsByDate.push({
						date: eventDate,
						events: eventData.filter(function (thisEvent) {
							return isEventOnDate(thisEvent, eventDate);
						})
					});

					lastEventDate = eventDate;
				}
			});

			return eventsByDate;
		};

		var get = function get(eventRequestModel) {
			return $q(function (resolve, reject) {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel).then(function (response) {
					resolve(dateSplitter(response.data));
				}, reject);
			});
		};

		return {
			get: get
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDataDateFormattingService = function eventDataDateFormattingService() {
		var formatSchedule = function formatSchedule(eventStart, eventLength) {
			if (!eventStart || isNaN(Date.parse(eventStart))) {
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

	app.factory('eventDataDateFormattingService', eventDataDateFormattingService);
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

		eventsService.get(eventServiceRequestModel).then(function (eventGroups) {
			self.eventGroups = eventGroups;
		});
	};

	EventsPageCtrl.$inject = ['$scope', '$animate', '$timeout', 'CONSTANTS', 'eventsService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDirective = function eventDirective(eventDataDateFormattingService) {
		var eventLink = function eventLink($scope) {
			var eventItem = $scope.eventItem;

			$scope.EventScheduleString = eventDataDateFormattingService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
		};

		var directive = {
			restrict: 'E',
			templateUrl: '/dist/js/apps/events-page/templates/event.html',
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['eventDataDateFormattingService'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDateDirective = function eventDateDirective() {
		var eventDateLink = function eventDateLink($scope, eventDateElement) {
			var date = new Date($scope.eventGroup.date);
			var dateSettings = {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			$scope.date = date.toLocaleDateString('en-US', dateSettings);
			$scope.events = $scope.eventGroup.events;
			$scope.id = 'datebar-' + $scope.eventGroup.date;

			if ($scope.$last) {
				$('.event-date-bar').sticky({
					zIndex: 100,
					getWidthFrom: 'body',
					responsiveWidth: true
				});
			}
		};

		var directive = {
			restrict: 'E',
			templateUrl: '/dist/js/apps/events-page/templates/eventDate.html',
			link: eventDateLink
		};

		return directive;
	};

	app.directive('eventDate', eventDateDirective);
})(angular.module('eventsPageApp'));