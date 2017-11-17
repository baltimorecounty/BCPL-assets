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
			eventTemplate: '/dist/js/apps/events-page/templates/event.html',
			eventDateTemplate: '/dist/js/apps/events-page/templates/eventDate.html',
			loadMoreTemplate: '/dist/js/apps/events-page/templates/loadMore.html'
		},
		requestChunkSize: 10
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventsService = function eventsService(CONSTANTS, $http, $q) {
		var isEventOnDate = function isEventOnDate(eventItem, eventDate) {
			var eventItemStartDateLocaleString = new Date(eventItem.EventStart).toLocaleDateString();
			return eventItemStartDateLocaleString === eventDate;
		};

		var dateSplitter = function dateSplitter(eventData) {
			var eventsByDate = [];
			var lastEventDateLocaleString = void 0;

			angular.forEach(eventData, function (eventItem) {
				var eventStartDateLocaleString = new Date(eventItem.EventStart).toLocaleDateString();

				if (lastEventDateLocaleString !== eventStartDateLocaleString) {
					eventsByDate.push({
						date: new Date(eventItem.EventStart),
						events: eventData.filter(function (thisEvent) {
							return isEventOnDate(thisEvent, eventStartDateLocaleString);
						})
					});

					lastEventDateLocaleString = eventStartDateLocaleString;
				}
			});

			return eventsByDate;
		};

		var get = function get(eventRequestModel) {
			var localeEventRequestModel = eventRequestModel;

			return $q(function (resolve, reject) {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, localeEventRequestModel).then(function (response) {
					if (response.data) {
						resolve({
							eventGroups: dateSplitter(response.data.Events),
							totalResults: response.data.TotalResults
						});
					} else {
						reject(response);
					}
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
			var eventEndDateMinutes = eventStartDate.getMinutes() + eventLength;
			eventEndDate.setMinutes(eventEndDateMinutes);

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

	var EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		var self = this;
		var firstPage = 1;
		var startDateLocaleString = new Date().toLocaleString();
		var endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);
		var endDateLocaleString = endDate.toLocaleString();
		var requestModel = {
			StartDate: startDateLocaleString,
			EndDate: endDateLocaleString,
			Page: firstPage,
			IsOngoingVisible: true,
			Limit: CONSTANTS.requestChunkSize
		};

		/* ** Public ** */

		self.eventGroups = [];
		self.keywords = '';
		self.chunkSize = CONSTANTS.requestChunkSize;
		self.totalResults = 0;
		self.isLastPage = false;
		self.areDatesInvalid = false;

		self.keywordSearch = function () {
			requestModel.Keyword = self.keywords;
			requestModel.StartDate = startDateLocaleString;
			requestModel.Page = 1;
			self.eventGroups = [];

			eventsService.get(requestModel).then(processEvents);
		};

		self.filterByDate = function () {
			if (isDateRangeValid(self.userStartDate, self.userEndDate)) {
				self.areDatesInvalid = false;
				requestModel.StartDate = self.userStartDate;
				requestModel.EndDate = self.userEndDate;
				requestModel.Page = 1;
				self.eventGroups = [];

				eventsService.get(requestModel).then(processEvents);
			} else {
				self.areDatesInvalid = true;
			}
		};

		self.loadNextPage = function () {
			requestModel.Page += 1;

			eventsService.get(requestModel).then(processAndCombineEvents);
		};

		self.clearFilters = function () {
			requestModel.StartDate = startDateLocaleString;
			requestModel.EndDate = endDateLocaleString;
			requestModel.Page = 1;
			requestModel.keywords = '';

			self.userStartDate = '';
			self.userEndDate = '';
			self.eventGroups = [];

			eventsService.get(requestModel).then(processEvents);
		};

		/* ** Private ** */

		var processEvents = function processEvents(eventResults) {
			self.isLastPage = isLastPage(eventResults.totalResults);
			self.eventGroups = eventResults.eventGroups;
		};

		var processAndCombineEvents = function processAndCombineEvents(eventResults) {
			self.isLastPage = isLastPage(eventResults.totalResults);
			self.eventGroups = combineEventGroups(self.eventGroups, eventResults.eventGroups);
		};

		var isLastPage = function isLastPage(totalResults) {
			var totalResultsSoFar = requestModel.Page * self.chunkSize;
			return totalResultsSoFar >= totalResults;
		};

		var isDateRangeValid = function isDateRangeValid(firstDate, secondDate) {
			if (firstDate && secondDate) {
				return moment(firstDate).isSameOrBefore(secondDate);
			}

			return false;
		};

		var isSameDay = function isSameDay(day1Date, day2Date) {
			if (day1Date && day2Date) {
				return moment(day1Date).isSame(day2Date, 'day');
			}

			return false;
		};

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

		eventsService.get(requestModel).then(processEvents);
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var eventDirective = function eventDirective(dateUtilityService, CONSTANTS) {
		var eventLink = function eventLink($scope) {
			var eventItem = $scope.eventItem;

			$scope.eventScheduleString = dateUtilityService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
		};

		var directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventTemplate,
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

			if (innerScope.eventGroupDisplay) {
				innerScope.date = innerScope.eventGroupDisplay.date.toLocaleDateString('en-US', dateSettings);
				innerScope.events = innerScope.eventGroupDisplay.events;
				innerScope.id = 'datebar-' + innerScope.date.replace(' ', '-');
			}

			$('.event-date-bar').sticky(eventDateBarStickySettings);
		};

		var directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventDateTemplate,
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
			templateUrl: CONSTANTS.templateUrls.loadMoreTemplate,
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