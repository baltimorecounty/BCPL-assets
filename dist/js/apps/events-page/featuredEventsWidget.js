'use strict';

(function () {
	'use strict';

	angular.module('eventsPageApp', ['ngRoute', 'ngSanitize']);
})();
'use strict';

(function () {
	'use strict';

	angular.module('featuredEventsWidget', []);
})();
'use strict';

(function (app) {
	'use strict';

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://localhost:54453',
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

(function (app) {
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
			var endpointUrl = CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events;

			console.log(eventRequestModel, endpointUrl);

			return $q(function (resolve, reject) {
				$http.post(endpointUrl, eventRequestModel).then(function (response) {
					console.log('resp', response);
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

		return {
			get: get,
			getById: getById
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
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

	var FeaturedEventsCtrl = function FeaturedEventsCtrl(eventsService) {
		var vm = this;

		var handleError = function handleError(error) {
			return console.error(error);
		}; // eslint-disable-line no-console

		var processEventData = function processEventData(featuredEventList) {
			console.log(featuredEventList);
			vm.featuredEventList = featuredEventList;
		};

		var requestPayload = {
			Limit: 4,
			Locations: [1, 2],
			EventTypes: [10]
		};

		eventsService.get(requestPayload).then(processEventData).catch(handleError);
	};

	FeaturedEventsCtrl.$inject = ['eventsService'];

	app.controller('FeaturedEventsCtrl', FeaturedEventsCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var featuredEventsDirective = function featuredEventsDirective(CONSTANTS) {
		var directive = {
			restrict: 'E',
			scope: {
				resultsToDisplay: '=',
				branch: '=',
				eventType: '='
			},
			templateUrl: CONSTANTS.templateUrls.featuredEventsTemplate,
			controller: 'FeaturedEventsCtrl',
			controllerAs: 'featuredEvents',
			bindToController: true
		};

		return directive;
	};

	featuredEventsDirective.$inject = ['CONSTANTS'];

	app.directive('featuredEvents', featuredEventsDirective);
})(angular.module('eventsPageApp'));