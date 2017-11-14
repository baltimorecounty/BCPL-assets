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

	var EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		var self = this;
		var firstPage = 1;
		var eventServiceRequestModel = {
			Limit: CONSTANTS.requestChunkSize,
			Page: firstPage,
			IsOngoingVisible: true
		};

		/* ** Public ** */

		self.eventGroups = [];

		self.chunkSize = CONSTANTS.requestChunkSize;

		self.loadNextPage = function () {
			eventServiceRequestModel.Page += 1;

			eventsService.get(eventServiceRequestModel).then(function (eventGroups) {
				var results = combineEventGroups(self.eventGroups, eventGroups);
				self.eventGroups = results;
			});
		};

		/* ** Private ** */

		/**
   * Compares dates base on locale date string.
   * @param {Date} day1Date
   * @param {Date} day2Date
   */
		var isSameDay = function isSameDay(day1Date, day2Date) {
			if (day1Date.toLocaleDateString && day2Date.toLocaleDateString) {
				return day1Date.toLocaleDateString() === day2Date.toLocaleDateString();
			}

			return false;
		};

		/**
   *
   * @param {*} oldEventGroups
   * @param {*} newEventGroups
   */
		var combineEventGroups = function combineEventGroups(oldEventGroups, newEventGroups) {
			var renderedEventGroups = oldEventGroups;
			var lastEventGroup = renderedEventGroups[renderedEventGroups.length - 1];

			angular.forEach(newEventGroups, function (eventGroup) {
				if (isSameDay(lastEventGroup.date, eventGroup.date)) {
					lastEventGroup.events = lastEventGroup.events.concat(eventGroup.events);
				} else {
					renderedEventGroups.push(eventGroup);
				}
			});

			return renderedEventGroups;
		};

		/* ** Init ** */

		eventsService.get(eventServiceRequestModel).then(function (eventGroups) {
			self.eventGroups = eventGroups;
		});
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDirective = function eventDirective(eventDataDateFormattingService, CONSTANTS) {
		var eventLink = function eventLink($scope) {
			var eventItem = $scope.eventItem;

			$scope.EventScheduleString = eventDataDateFormattingService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
		};

		var directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.event,
			link: eventLink
		};

		return directive;
	};

	eventDirective.$inject = ['eventDataDateFormattingService', 'CONSTANTS'];

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

			/* scope.$watch('eventGroupDisplay', (newVal, oldVal) => {
   	// console.log(newVal);
   }); */

			if (scope.$last) {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			}
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