'use strict';

(function (moment) {
	'use strict';

	var app = angular.module('dataServices', []);

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
					if (response.data) {
						if (response.data.Description) {
							response.data.Description = response.data.Description.replace(/<[\w/]+>/g, '');
						}

						var momentDateFormat = 'M/D/YYYY @ h:mm a';

						// Since moment().subtract() mutates the date rather than returning a new date,
						// we need to calculate the date fresh every time.
						response.data.registrationStarts = moment(response.data.EventStart).subtract(7, 'days');
						response.data.registrationEnds = moment(response.data.EventStart).subtract(30, 'minutes');
						response.data.registrationStartsDisplay = formatTime(response.data.registrationStarts.format(momentDateFormat));
						response.data.registrationEndsDisplay = formatTime(response.data.registrationEnds.format(momentDateFormat));
						response.data.isStarted = moment(response.data.EventStart).isBefore();
						response.data.isRegistrationClosed = response.data.registrationEnds.isBefore();

						response.data.isRegistrationWindow = moment().isBetween(response.data.registrationStarts, response.data.registrationEnds);
						response.data.isFull = response.data.RegistrationTypeCodeEnum === 1 && response.data.MainSpotsAvailable === 0;
						response.data.isWaiting = response.data.WaitSpotsAvailable > 0;
						response.data.requiresRegistration = response.data.RegistrationTypeCodeEnum !== 0;
						response.data.shouldDisplayRegistrationButton = shouldDisplayRegistrationButton(response.data);

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

		var shouldDisplayRegistrationButton = function shouldDisplayRegistrationButton(eventData) {
			return !eventData.isStarted && eventData.isRegistrationWindow && eventData.requiresRegistration && (!eventData.isFull || eventData.isFull && eventData.isWaiting);
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

	eventsService.$inject = ['events.CONSTANTS', '$http', '$q'];

	app.factory('dataServices.eventsService', eventsService);
})(window.moment);
'use strict';

(function () {
	'use strict';

	angular.module('featuredEventsWidgetApp', ['dataServices', 'events', 'ngAria']);
})();
'use strict';

(function () {
	'use strict';

	var app = angular.module('events', []);

	var constants = {
		// baseUrl: 'https://testservices.bcpl.info',
		baseUrl: 'http://oit226471:1919',
		serviceUrls: {
			events: '/api/evanced/signup/events',
			eventRegistration: '/api/evanced/signup/registration',
			eventTypes: '/api/evanced/signup/eventtypes'
		},
		remoteServiceUrls: {
			ageGroups: 'https://bcpl.evanced.info/api/signup/agegroups',
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

	app.constant('events.CONSTANTS', constants);
})();
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

	featuredEventsDirective.$inject = ['events.CONSTANTS', 'dataServices.eventsService'];

	app.directive('featuredEvents', featuredEventsDirective);
})(angular.module('featuredEventsWidgetApp'));