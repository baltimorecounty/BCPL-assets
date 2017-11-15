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
		},
		templateUrls: {
			event: '/dist/js/apps/events-page/templates/event.html',
			eventDate: '/dist/js/apps/events-page/templates/eventDate.html',
			loadMore: '/dist/js/apps/events-page/templates/loadMore.html'
		},
		requestChunkSize: 10
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
						date: new Date(eventItem.EventStart),
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
			var localeEventRequestModel = eventRequestModel;

			localeEventRequestModel.StartDate = localeEventRequestModel.StartDate.toLocaleDateString();
			localeEventRequestModel.EndDate = localeEventRequestModel.EndDate.toLocaleDateString();

			return $q(function (resolve, reject) {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, localeEventRequestModel).then(function (response) {
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (app) {
	var dateUtilityService = function dateUtilityService() {
		var addDays = function addDays(dateOrString, daysToAdd) {
			var date = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;

			if ((typeof date === 'undefined' ? 'undefined' : _typeof(date)) !== 'object' || date === 'Invalid Date') {
				return date;
			}

			date.setDate(date.getDate() + daysToAdd);

			return date;
		};

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
			addDays: addDays,
			formatSchedule: formatSchedule
		};
	};

	app.factory('dateUtilityService', dateUtilityService);
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

	var EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService, dateUtility) {
		var self = this;
		var firstPage = 1;
		var requestModel = {
			StartDate: new Date(),
			EndDate: new Date(),
			Page: firstPage,
			IsOngoingVisible: true
		};

		/* ** Public ** */

		self.eventGroups = [];

		self.chunkSize = CONSTANTS.requestChunkSize;

		self.loadNextPage = function () {
			requestModel.StartDate = dateUtility.addDays(requestModel.StartDate, 1);
			requestModel.EndDate = dateUtility.addDays(requestModel.EndDate, 1);

			eventsService.get(requestModel).then(function (eventGroups) {
				self.eventGroups = self.eventGroups.concat(eventGroups);
			});
		};

		/* ** Init ** */

		eventsService.get(requestModel).then(function (eventGroups) {
			self.eventGroups = eventGroups;
		});
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDirective = function eventDirective(dateUtilityService, CONSTANTS) {
		var eventLink = function eventLink($scope) {
			var eventItem = $scope.eventItem;

			$scope.EventScheduleString = dateUtilityService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
		};

		var directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.event,
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['dateUtilityService', 'CONSTANTS'];

	app.directive('event', eventDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDateDirective = function eventDateDirective(CONSTANTS) {
		var eventDateLink = function eventDateLink(scope) {
			var innerScope = scope;

			var dateSettings = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			var eventDateBarStickySettings = {
				zIndex: 100,
				responsiveWidth: true
			};

			innerScope.date = innerScope.eventGroupDisplay.date.toLocaleDateString('en-US', dateSettings);
			innerScope.events = innerScope.eventGroupDisplay.events;
			innerScope.id = 'datebar-' + innerScope.date.replace(' ', '-');

			$('.event-date-bar').sticky(eventDateBarStickySettings);
		};

		var directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventDate,
			link: eventDateLink,
			scope: {
				eventGroupDisplay: '='
			}
		};

		return directive;
	};

	eventDateDirective.$inject = ['CONSTANTS'];

	app.directive('eventDate', eventDateDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var loadMoreDirective = function loadMoreDirective(CONSTANTS) {
		var directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.loadMore,
			scope: {
				loadNextPage: '=',
				chunkSize: '='
			}
		};

		return directive;
	};

	loadMoreDirective.$inject = ['CONSTANTS'];

	app.directive('loadMore', loadMoreDirective);
})(angular.module('eventsPageApp'));