'use strict';

(function () {
	'use strict';

	angular.module('eventsPageApp', ['ngRoute', 'ngSanitize']);
})();
'use strict';

/**
 * Start of the Featured Events Widget
 */
(function () {
  'use strict';

  angular.module('featuredEventsWidget', []);
})();
'use strict';

(function (app) {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://oit226471:1919',
		serviceUrls: {
			events: '/api/evanced/signup/events',
			eventRegistration: '/api/evanced/signup/registration'
		},
		remoteServiceUrls: {
			ageGroups: 'https://bcpl.evanced.info/api/signup/agegroups',
			eventTypes: 'https://bcpl.evanced.info/api/signup/eventtypes',
			locations: 'https://bcpl.evanced.info/api/signup/locations'
		},
		templateUrls: {
			datePickersTemplate: '/_js/apps/events-page/templates/datePickers.html',
			eventsListTemplate: '/_js/apps/events-page/templates/eventsList.html',
			filtersTemplate: '/_js/apps/events-page/templates/filters.html',
			filtersExpandosTemplate: '/_js/apps/events-page/templates/filters-expandos.html',
			loadMoreTemplate: '/_js/apps/events-page/templates/loadMore.html',
			featuredEventsTemplate: '/_js/apps/events-page/templates/featuredEvents.html'
		},
		partialUrls: {
			eventListPartial: '/_js/apps/events-page/partials/eventList.html',
			eventDetailsPartial: '/_js/apps/events-page/partials/eventDetails.html',
			eventRegistrationPartial: '/_js/apps/events-page/partials/eventRegistration.html'
		},
		requestChunkSize: 10
	};

	app.constant('CONSTANTS', constants);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var config = function config($routeProvider, CONSTANTS) {
		$routeProvider.when('/', {
			templateUrl: CONSTANTS.partialUrls.eventListPartial,
			controller: 'EventsPageCtrl',
			controllerAs: 'eventsPage'
		}).when('/:id', {
			templateUrl: CONSTANTS.partialUrls.eventDetailsPartial,
			controller: 'EventDetailsCtrl',
			controllerAs: 'eventDetailsPage'
		}).when('/register/:id', {
			templateUrl: CONSTANTS.partialUrls.eventRegistrationPartial,
			controller: 'EventRegistrationCtrl',
			controllerAs: 'eventRegistrationPage'
		});
	};

	config.$inject = ['$routeProvider', 'CONSTANTS'];

	app.config(config);
})(angular.module('eventsPageApp'));
'use strict';

(function (app, moment) {
	'use strict';

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
			return $q(function (resolve, reject) {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel).then(function (response) {
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

		var getById = function getById(id) {
			return $q(function (resolve, reject) {
				$http.get(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events + '/' + id).then(function (response) {
					if (response.data && response.data.Description) {
						response.data.Description = response.data.Description.replace(/<[\w/]+>/g, '');
						resolve(response.data);
					} else {
						reject(response);
					}
				}, reject);
			});
		};

		var formatTime = function formatTime(unformattedTime) {
			return unformattedTime.replace(':00', '').replace(/\w\w$/, function (foundString) {
				return foundString.split('').join('.') + '.';
			});
		};

		var processEvent = function processEvent(calendarEvent) {
			var localCalendarEvent = calendarEvent;
			var eventMoment = moment(calendarEvent.EventStart);

			localCalendarEvent.eventMonth = eventMoment.format('MMM');
			localCalendarEvent.eventDate = eventMoment.format('D');
			localCalendarEvent.eventTime = formatTime(eventMoment.format('h:mm a'));
			localCalendarEvent.requiresRegistration = localCalendarEvent.RegistrationTypeCodeEnum !== 0;

			return localCalendarEvent;
		};

		var formatFeaturedEvents = function formatFeaturedEvents(events) {
			var featuredEvents = [];

			events.forEach(function (event) {
				var processedEvent = processEvent(event);
				featuredEvents.push(processedEvent);
			});

			return featuredEvents;
		};

		var getFeaturedEvents = function getFeaturedEvents(eventRequestModel) {
			return $q(function (resolve, reject) {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel).then(function (response) {
					if (response.data) {
						resolve(formatFeaturedEvents(response.data.Events));
					} else {
						reject(response);
					}
				}, reject);
			});
		};

		return {
			get: get,
			getById: getById,
			getFeaturedEvents: getFeaturedEvents
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'), window.moment);
'use strict';

(function (app) {
	'use strict';

	var metaService = function metaService($http, $q) {
		var request = function request(endpointUrl) {
			return $q(function (resolve, reject) {
				$http.get(endpointUrl).then(function (response) {
					resolve(response.data);
				}, function (err) {
					reject(err);
				});
			});
		};

		return {
			request: request
		};
	};

	metaService.$inject = ['$http', '$q'];

	app.factory('metaService', metaService);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var registrationService = function registrationService(CONSTANTS, $http, $q) {
		var register = function register(registrationModel) {
			return $q(function (resolve, reject) {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.eventRegistration, registrationModel).then(function (response) {
					if (response.data) {
						resolve({
							data: response.data
						});
					} else {
						reject(response);
					}
				}, reject);
			});
		};

		return {
			register: register
		};
	};

	registrationService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('registrationService', registrationService);
})(angular.module('eventsPageApp'));
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (app) {
	'use strict';

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

			var eventStartDate = moment(eventStart);
			var eventEndDate = moment(eventStart).add(eventLength, 'm');
			var startHour = get12HourValue(eventStartDate);
			var startMinutes = eventStartDate.minute();
			var startAmPm = getAmPm(eventStartDate);
			var endHour = get12HourValue(eventEndDate);
			var endMinutes = eventEndDate.minute();
			var endAmPm = getAmPm(eventEndDate);

			return '' + startHour + (startMinutes === 0 ? '' : ':' + startMinutes) + ' ' + (startAmPm === endAmPm ? '' : startAmPm) + ' to ' + endHour + (endMinutes === 0 ? '' : ':' + endMinutes) + ' ' + endAmPm;
		};

		var get12HourValue = function get12HourValue(date) {
			var rawHours = date.hour();

			if (rawHours === 0) return 12;

			if (rawHours <= 12) return rawHours;

			return rawHours - 12;
		};

		var getAmPm = function getAmPm(date) {
			return date.hour() < 12 ? 'a.m.' : 'p.m.';
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
	'use strict';

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

	var featuredEventsLink = function featuredEventsLink(scope, eventsService) {
		var branches = scope.branches && scope.branches.length ? scope.branches : [];
		var eventTypes = scope.eventTypes && scope.eventTypes.length ? scope.eventTypes : [];
		var resultsToDisplay = scope.resultsToDisplay || 3;
		var shouldPrioritzeFeatured = !!scope.prioritizeFeatured;

		var buildRequestPayLoad = function buildRequestPayLoad(limit, locations, events, prioritizeFeatured) {
			var payLoad = {
				Limit: limit,
				OnlyFeaturedEvents: prioritizeFeatured
			};

			if (branches.length) {
				payLoad.Locations = locations;
			}

			if (eventTypes.length) {
				payLoad.EventsTypes = events;
			}

			return payLoad;
		};
		var handleError = function handleError(error) {
			return console.error(error);
		};

		var eventRequestPayload = buildRequestPayLoad(resultsToDisplay, branches, eventTypes, shouldPrioritzeFeatured);

		eventsService.getFeaturedEvents(eventRequestPayload).then(function (featuredEventList) {
			scope.featuredEventList = featuredEventList; // eslint-disable-line
			if (featuredEventList.length === 0) {
				scope.resultsToDisplay = 0; // eslint-disable-line
			}
		}).catch(handleError); // eslint-disable-line no-console
	};

	var featuredEventsDirective = function featuredEventsDirective(CONSTANTS, eventsService) {
		var directive = {
			restrict: 'E',
			scope: {
				branches: '=',
				resultsToDisplay: '=',
				eventTypes: '=',
				prioritizeFeatured: '='
			},
			templateUrl: CONSTANTS.templateUrls.featuredEventsTemplate,
			link: function link(scope) {
				return featuredEventsLink(scope, eventsService);
			}
		};

		return directive;
	};

	featuredEventsDirective.$inject = ['CONSTANTS', 'eventsService'];

	app.directive('featuredEvents', featuredEventsDirective);
})(angular.module('eventsPageApp'));