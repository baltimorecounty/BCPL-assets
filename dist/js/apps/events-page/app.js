'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedFilters', []);

	var filterHelpers = function filterHelpers($location) {
		var removeObjectByKey = function removeObjectByKey(key, obj) {
			var newObj = Object.assign({}, obj);
			if (key) {
				delete newObj[key];
			}
			return newObj;
		};

		var clearQueryParams = function clearQueryParams(keys) {
			if (!keys) {
				$location.search({});
				return;
			}

			var queryParams = Object.assign({}, $location.search());

			keys.forEach(function (key) {
				queryParams = removeObjectByKey(key, queryParams);
			});

			$location.search(queryParams);
		};

		var doesKeyExist = function doesKeyExist(queryParams, key) {
			if (!key) return false;

			var matches = Object.keys(queryParams).filter(function (paramKey) {
				return paramKey.toLowerCase() === key.toLowerCase();
			});

			return !!matches.length;
		};

		// TODO: FILTERS MUST BE A STRING???
		var getFiltersFromString = function getFiltersFromString(filterStr, isDate) {
			if (!filterStr) return [];

			return filterStr.indexOf(',') > -1 ? isDate ? filterStr : filterStr.split(',') : [filterStr];
		};

		var getQueryParams = function getQueryParams() {
			return $location.search();
		};

		var getQueryParamValuesByKey = function getQueryParamValuesByKey(queryParams, key, isDate) {
			return Object.hasOwnProperty.call(queryParams, key) ? getFiltersFromString(queryParams[key], isDate) : isDate ? '' : [];
		};

		var setQueryParams = function setQueryParams(keyValPairs) {
			keyValPairs.forEach(function (keyValPair) {
				var key = keyValPair.key,
				    val = keyValPair.val;


				if (!key) return;

				var queryParam = $location.search();
				queryParam[key] = val;

				$location.search(queryParam);
			});
		};

		var updateQueryParams = function updateQueryParams(keyValPairs) {
			var queryParams = getQueryParams();

			keyValPairs.forEach(function (keyValPair) {
				var key = keyValPair.key,
				    val = keyValPair.val;

				var doesQueryParamKeyExist = doesKeyExist(queryParams, key);

				if (doesQueryParamKeyExist) {
					var existingFilterValues = getQueryParamValuesByKey(queryParams, key);
					var shouldRemoveFilter = existingFilterValues.includes(val);
					var newFilterValues = [];

					if (shouldRemoveFilter) {
						var targetFilterIndex = existingFilterValues.indexOf(val);
						existingFilterValues.splice(targetFilterIndex, 1);
					} else {
						existingFilterValues.push(val);
					}

					newFilterValues = existingFilterValues;

					if (!newFilterValues.length) {
						clearQueryParams([key]);
					} else {
						setQueryParams([{
							key: key,
							val: newFilterValues.join(',')
						}]);
					}
				} else {
					setQueryParams([{ key: key, val: val }]);
				}
			});
		};

		return {
			clearQueryParams: clearQueryParams,
			doesKeyExist: doesKeyExist,
			getFiltersFromString: getFiltersFromString,
			getQueryParams: getQueryParams,
			getQueryParamValuesByKey: getQueryParamValuesByKey,
			setQueryParams: setQueryParams,
			updateQueryParams: updateQueryParams
		};
	};

	app.factory('sharedFilters.filterHelperService', ['$location', filterHelpers]);
})();
'use strict';

namespacer('bcpl');

// requires bootstrap.js to be included in the page
bcpl.boostrapCollapseHelper = function ($) {
	var toggleCollapseByIds = function toggleCollapseByIds(panels) {
		var activePanels = panels.activePanels,
		    inActivePanels = panels.inActivePanels;


		activePanels.forEach(function (id) {
			$('#' + id).collapse('show');
		});

		inActivePanels.forEach(function (id) {
			$('#' + id).collapse('hide');
		});
	};

	return {
		toggleCollapseByIds: toggleCollapseByIds
	};
}(jQuery);
'use strict';

(function () {
	'use strict';

	angular.module('eventsPageApp', ['dataServices', 'events', 'sharedFilters', 'ngAria', 'ngRoute', 'ngSanitize']);
})();
'use strict';

(function () {
	'use strict';

	var app = angular.module('events', []);

	var constants = {
		baseUrl: 'https://services.bcpl.info',
		serviceUrls: {
			events: '/api/evanced/signup/events',
			eventRegistration: '/api/evanced/signup/registration',
			eventTypes: '/api/evanced/signup/eventtypes',
			downloads: '/api/evanced/signup/download'
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
		requestChunkSize: 10,
		ageDisclaimer: {
			message: 'Children under 8 must be accompanied by an adult',
			ageGroupIds: [9, 10, 11, 12, 13] // All ages but teen and adults, https://bcpl.evanced.info/api/signup/agegroups
		},
		eventDetailsError: {
			message: 'There was a problem loading this event\'s details. Please select a different event.'
		}
	};

	app.constant('events.CONSTANTS', constants);
})();
'use strict';

(function (app) {
	'use strict';

	var config = function config($locationProvider, $routeProvider, CONSTANTS) {
		$routeProvider.when('/', {
			templateUrl: CONSTANTS.partialUrls.eventListPartial,
			controller: 'EventsPageCtrl',
			controllerAs: 'eventsPage',
			reloadOnSearch: false
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

	/**
  * We're doing this to get around SiteExecutive's butchering of AngularJS URLs.
  */
	var run = function run($window, $location) {
		var absoluteUrl = $location.absUrl();

		if (absoluteUrl.indexOf('#!') === -1 && absoluteUrl.indexOf('?') > -1) {
			var eventId = bcpl.utility.querystringer.getAsDictionary().eventid;

			$window.location = eventId ? '/events-and-programs/list.html#!/' + eventId : '/events-and-programs/list.html#!/' + $window.location.search; // eslint-disable-line no-param-reassign
		}
	};

	config.$inject = ['$locationProvider', '$routeProvider', 'events.CONSTANTS'];
	run.$inject = ['$window', '$location'];

	app.config(config).run(run);
})(angular.module('eventsPageApp'));
'use strict';

(function (moment) {
	'use strict';

	var registrationIsRequiredCode = 1;
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
				var fixedEvent = eventItem.EventStart ? eventItem : setStartDateForOnGoingEvent(eventItem, moment());

				var eventStartDateLocaleString = new Date(fixedEvent.EventStart).toLocaleDateString();

				if (lastEventDateLocaleString !== eventStartDateLocaleString) {
					var eventDate = fixedEvent.EventStart || fixedEvent.OnGoingStartDate;
					var filteredEvents = eventData.filter(function (thisEvent) {
						return isEventOnDate(thisEvent, eventStartDateLocaleString);
					});

					eventsByDate.push({
						date: new Date(eventDate),
						events: filteredEvents
					});

					lastEventDateLocaleString = eventStartDateLocaleString;
				}
			});

			return eventsByDate;
		};

		var sortEventGroups = function sortEventGroups(eventGroupA, eventGroupB) {
			if (moment(eventGroupA.date).isSame(eventGroupB.date, 'day')) {
				return 0;
			}

			if (moment(eventGroupA.date).isBefore(eventGroupB.date)) {
				return -1;
			}

			return 1;
		};

		var get = function get(eventRequestModel) {
			return $q(function (resolve, reject) {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel).then(function (response) {
					if (response.data) {
						var eventGroups = dateSplitter(response.data.Events);
						var sortedEventGroups = eventGroups.sort(sortEventGroups);

						resolve({
							eventGroups: sortedEventGroups,
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
						var momentDayFormat = 'M/D/YYYY';

						// Since moment().subtract() mutates the date rather than returning a new date,
						// we need to calculate the date fresh every time.
						response.data.registrationStarts = moment(response.data.EventStart).subtract(7, 'days');
						response.data.registrationEnds = moment(response.data.EventStart).subtract(30, 'minutes');
						response.data.registrationStartsDisplay = formatTime(response.data.registrationStarts.format(momentDateFormat));
						response.data.registrationEndsDisplay = formatTime(response.data.registrationEnds.format(momentDateFormat));
						response.data.onGoingStartDate = moment(response.data.OnGoingStartDate).format(momentDayFormat);
						response.data.onGoingEndDate = moment(response.data.OnGoingEndDate).format(momentDayFormat);
						response.data.isStarted = moment(response.data.EventStart).isBefore();
						response.data.isRegistrationClosed = response.data.registrationEnds.isBefore();

						response.data.isRegistrationWindow = moment().isBetween(response.data.registrationStarts, response.data.registrationEnds);
						response.data.isFull = response.data.RegistrationTypeCodeEnum === registrationIsRequiredCode && response.data.MainSpotsAvailable === 0;
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

		var setStartDateForOnGoingEvent = function setStartDateForOnGoingEvent(signupEvent, currentDate) {
			var cleanOnGoingStartDate = moment(signupEvent.OnGoingStartDate);
			var isEventStartingToday = moment(cleanOnGoingStartDate).isSame(currentDate, 'day');
			var localSignupEvent = signupEvent;
			var isFutureEvent = cleanOnGoingStartDate.isAfter(currentDate);
			localSignupEvent.EventStart = (isFutureEvent || isEventStartingToday) && signupEvent.OnGoingStartDate;

			// Cant' short-circuit this since it'll return false instead of date.
			if (!localSignupEvent.EventStart) {
				localSignupEvent.EventStart = currentDate;
			}

			return localSignupEvent;
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

	registrationService.$inject = ['events.CONSTANTS', '$http', '$q'];

	app.factory('registrationService', registrationService);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	var ageDisclaimerService = function ageDisclaimerService($window, CONSTANTS) {
		var shouldShowDisclaimer = function shouldShowDisclaimer(eventItem) {
			var ageGroupsForDisclaimer = CONSTANTS.ageDisclaimer.ageGroupIds;
			var ageGroupsFromEvent = eventItem.AgeGroups;

			var intersection = $window._.intersection(ageGroupsForDisclaimer, ageGroupsFromEvent);

			return intersection && intersection.length > 0;
		};

		return {
			shouldShowDisclaimer: shouldShowDisclaimer
		};
	};

	ageDisclaimerService.$inject = ['$window', 'events.CONSTANTS'];

	app.factory('ageDisclaimerService', ageDisclaimerService);
})(angular.module('eventsPageApp'));
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (app) {
	'use strict';

	var dateUtilityService = function dateUtilityService() {
		var addDays = function addDays(dateOrString, daysToAdd) {
			var date = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;

			if ((typeof date === 'undefined' ? 'undefined' : _typeof(date)) !== 'object') return date;

			date.setDate(date.getDate() + daysToAdd);

			return date;
		};

		/**
   * Formats the event schedule for display.
   *
   * @param {{ EventStart: Date, OnGoingStartDate: string, OnGoingEndDate: string }} eventItem
   * @param {number} eventLength
   * @param {boolean} isAllDay
   */
		var formatSchedule = function formatSchedule(eventItem, eventLength, isAllDay) {
			var eventStart = eventItem.EventStart || null;
			var onGoingStartDate = eventItem.OnGoingStartDate;
			var onGoingEndDate = eventItem.OnGoingEndDate;

			if (isAllDay) return 'All Day';

			if (!eventStart && !onGoingStartDate && !onGoingEndDate || eventStart && isNaN(Date.parse(eventStart))) {
				return 'Bad start date format';
			}

			if (eventStart && (typeof eventLength !== 'number' || eventLength < 0)) {
				return 'Bad event length format';
			}

			if (onGoingStartDate && onGoingEndDate) {
				var dateFormat = 'M/D';
				return moment(onGoingStartDate).format(dateFormat) + ' to ' + moment(onGoingEndDate).format(dateFormat);
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

(function (app, ICS) {
	'use strict';

	var downloadCalendarEventService = function downloadCalendarEventService($window) {
		var createEvent = function createEvent(calendarParts) {
			var eventTitle = calendarParts.eventTitle,
			    eventDescription = calendarParts.eventDescription,
			    eventLocation = calendarParts.eventLocation,
			    eventStartDate = calendarParts.eventStartDate,
			    eventEndDate = calendarParts.eventEndDate;


			var calEvent = new ICS();
			calEvent.addEvent(eventTitle, eventDescription, eventLocation, eventStartDate, eventEndDate);

			return calEvent;
		};

		var downloadCalendarEvent = function downloadCalendarEvent(eventDetails) {
			var calendarParts = getCalendarParts(eventDetails);
			var calendarEvent = createEvent(calendarParts);

			calendarEvent.download(calendarParts.eventTitle);
		};

		var formatTime = function formatTime(timeStr) {
			var timeParts = timeStr.split(' ');

			if (timeParts.length === 2) {
				var time = timeParts[0].trim();
				var amPm = timeParts[1].trim();

				var formattedTime = time.indexOf(':') > -1 ? time + ':00' : time + ':00:00';

				return formattedTime + ' ' + amPm;
			}

			return timeStr;
		};

		var getCalendarParts = function getCalendarParts(eventDetails) {
			var eventDescription = eventDetails.Description,
			    LocationName = eventDetails.LocationName,
			    Title = eventDetails.Title;


			var eventTitle = 'Baltimore County Public Library, ' + LocationName + ' Branch - ' + Title;
			var eventLocation = LocationName + ' Branch';
			var eventDates = getEventDates(eventDetails);

			return {
				eventTitle: eventTitle,
				eventDescription: eventDescription,
				eventLocation: eventLocation,
				eventStartDate: eventDates.eventStartDate,
				eventEndDate: eventDates.eventEndDate
			};
		};

		var getEndDate = function getEndDate(startDateAsString, eventDetails) {
			var AllDay = eventDetails.AllDay,
			    EventSchedule = eventDetails.EventSchedule,
			    EventStart = eventDetails.EventStart,
			    OnGoingEndDate = eventDetails.OnGoingEndDate;


			var endDateAsString = $window.moment(startDateAsString).format('MM/DD/YYYY');
			var eventEndTime = getEndTime(EventSchedule, AllDay);
			var endDateTimeAsString = !EventStart ? OnGoingEndDate : endDateAsString + ' ' + eventEndTime;

			return $window.moment(endDateTimeAsString).format('MM/DD/YYYY h:mm:ss a');
		};

		var getEndTime = function getEndTime(eventSchedule, isAllDay) {
			if (isAllDay) return '11:59:59 PM';

			var timeParts = eventSchedule.split('to');

			return timeParts.length === 2 ? formatTime(timeParts[1].trim().replace(/\./g, '')) : null;
		};

		var getStartDate = function getStartDate(eventDetails) {
			var EventStart = eventDetails.EventStart,
			    OnGoingStartDate = eventDetails.OnGoingStartDate;

			var startDateAsString = EventStart || OnGoingStartDate;
			return $window.moment(startDateAsString).format('MM/DD/YYYY h:mm:ss a');
		};

		var getEventDates = function getEventDates(eventDetails) {
			var eventStartDate = getStartDate(eventDetails);
			var eventEndDate = getEndDate(eventStartDate, eventDetails);

			return {
				eventStartDate: eventStartDate,
				eventEndDate: eventEndDate
			};
		};

		return {
			createEvent: createEvent,
			downloadCalendarEvent: downloadCalendarEvent,
			getCalendarParts: getCalendarParts,
			getEndDate: getEndDate,
			getEndTime: getEndTime,
			getStartDate: getStartDate,
			getEventDates: getEventDates,
			formatTime: formatTime
		};
	};

	downloadCalendarEventService.$inject = ['$window'];

	app.factory('downloadCalendarEventService', downloadCalendarEventService);
})(angular.module('eventsPageApp'), window.ics);
'use strict';

(function (app) {
	'use strict';

	var emailUtilityService = function emailUtilityService() {
		var cleanUrl = function cleanUrl(url) {
			return url.replace('!', '%21').replace('#', '%23');
		};
		var getEmailBody = function getEmailBody(destinationUrl) {
			return 'Check out this event at the Baltimore County Public Library: ' + cleanUrl(destinationUrl);
		};
		var getEmailSubject = function getEmailSubject(data) {
			return data.EventStartDate + ' - ' + data.Title;
		};
		var getShareUrl = function getShareUrl(data, url) {
			var emailBody = getEmailBody(url);
			var emailSubject = getEmailSubject(data);

			return 'mailto:?subject=' + emailSubject + '&body=' + emailBody;
		};

		return {
			cleanUrl: cleanUrl,
			getEmailBody: getEmailBody,
			getEmailSubject: getEmailSubject,
			getShareUrl: getShareUrl
		};
	};

	app.factory('emailUtilityService', emailUtilityService);
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

	var RequestModel = function RequestModel($window, CONSTANTS) {
		return function (requestModel) {
			var model = requestModel || {};

			var startDateLocaleString = $window.moment().format();
			var endDateLocaleString = $window.moment().add(30, 'd').format();

			return {
				StartDate: model.StartDate || startDateLocaleString,
				EndDate: model.EndDate || endDateLocaleString,
				Page: model.Page || 1,
				IsOngoingVisible: model.IsOngoingVisible || true,
				IsSpacesReservationVisible: model.IsSpacesReservationVisible || false,
				Limit: model.limit || CONSTANTS.requestChunkSize,
				EventsTypes: model.eventTypes || [],
				AgeGroups: model.AgeGroups || [],
				Locations: model.locations || [],
				Keyword: model.Keyword || ''
			};
		};
	};

	RequestModel.$inject = ['$window', 'events.CONSTANTS'];

	app.factory('RequestModel', RequestModel);
})(angular.module('eventsPageApp'));
'use strict';

(function (app, ICS) {
	'use strict';

	var EventDetailsCtrl = function EventsPageCtrl($scope, $window, $timeout, $routeParams, CONSTANTS, eventsService, dateUtilityService, emailUtilityService, downloadCalendarEventService, ageDisclaimerService) {
		$window.scrollTo(0, 0); // Ensure the event details are visible on mobile

		var vm = this;
		var id = $routeParams.id;

		vm.data = {};
		vm.data.EventStartDate = '';
		vm.data.EventStartTime = '';
		vm.data.EventEndTime = '';
		vm.isLoading = true;
		vm.isError = false;
		vm.requestErrorMessage = CONSTANTS.eventDetailsError.message;

		var processEventData = function processEventData(data) {
			if (Object.prototype.hasOwnProperty.call(data, 'EventId') && !data.EventId) {
				requestError();
				return;
			}

			vm.data = data;
			vm.data.EventStartDate = $window.moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data, vm.data.EventLength, vm.data.AllDay);
			vm.isRegistrationRequired = vm.data.RegistrationTypeCodeEnum !== 0;
			var eventDate = vm.data.EventStart || vm.data.OnGoingStartDate;
			vm.eventDayOfWeek = $window.moment(eventDate).format('dddd');
			vm.onGoingEventEndDayOfWeek = vm.data.OnGoingEndDate && $window.moment(vm.data.OnGoingEndDate).format('dddd');
			vm.isOver = vm.data.EventStart ? $window.moment().isAfter($window.moment(eventDate).add(vm.data.EventLength, 'm')) : $window.moment().startOf('day').isAfter($window.moment(eventDate).endOf('day'));
			vm.isLoading = false;
			vm.shareUrl = emailUtilityService.getShareUrl(vm.data, $window.location.href);
			vm.shouldShowDisclaimer = ageDisclaimerService.shouldShowDisclaimer(vm.data);
			vm.disclaimer = CONSTANTS.ageDisclaimer.message;
			vm.downloadUrl = '' + CONSTANTS.baseUrl + CONSTANTS.serviceUrls.downloads + '/' + id;
		};

		var requestError = function requestError() {
			vm.isLoading = false;
			vm.isError = true;
		};

		eventsService.getById(id).then(processEventData).catch(requestError);
	};

	EventDetailsCtrl.$inject = ['$scope', '$window', '$timeout', '$routeParams', 'events.CONSTANTS', 'dataServices.eventsService', 'dateUtilityService', 'emailUtilityService', 'downloadCalendarEventService', 'ageDisclaimerService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'), window.ics);
'use strict';

(function (app, bcFormat) {
	'use strict';

	var EventRegistrationCtrl = function EventsPageCtrl($window, $scope, $routeParams, CONSTANTS, eventsService, registrationService, dateUtilityService, emailUtilityService, downloadCalendarEventService, ageDisclaimerService) {
		$window.scrollTo(0, 0); // Ensure the event details are visible on mobile

		var id = $routeParams.id;
		var vm = this;

		vm.showGroups = false;
		vm.isGroup = 'false';
		vm.isSubmitted = false;
		vm.isLoadingResults = false;
		vm.formConfirmationMessage = null;
		vm.downloadUrl = '' + CONSTANTS.baseUrl + CONSTANTS.serviceUrls.downloads + '/' + id;

		var hasConfirmationMessage = function hasConfirmationMessage(data) {
			return data && Object.prototype.hasOwnProperty.call(data, 'ConfirmationMessage') && data.ConfirmationMessage && data.ConfirmationMessage.length;
		};

		vm.isFieldValid = function (form, field) {
			return (form[field].$touched || form.$submitted) && form[field].$invalid;
		};

		vm.submitHandler = function (submitEvent, registrationForm) {
			if (!registrationForm.$valid) {
				vm.isLoadingResults = false;
				return;
			}

			var postModel = {
				EventId: parseInt(id, 10),
				FirstName: vm.firstName,
				LastName: vm.lastName,
				Email: vm.email,
				Phone: bcFormat('phoneNumber', vm.phone, 'xxx-xxx-xxxx'),
				IsGroup: vm.isGroup === 'true',
				GroupCount: vm.groupCount
			};

			registrationService.register(postModel).then(function (postResult) {
				// jQuery since ngAnimate can't do this.
				var topOfContent = angular.element('.main-content').first().offset().top;
				vm.postResult = postResult.data;

				var data = vm.postResult.Data;

				if (hasConfirmationMessage(data)) {
					vm.formConfirmationMessage = data.ConfirmationMessage;
				} else {
					var hasErrors = vm.postResult && Object.prototype.hasOwnProperty.call(vm.postResult, 'Errors') && vm.postResult.Errors.length;

					vm.formConfirmationMessage = hasErrors ? vm.postResult.Errors[0].Error : 'Something went wrong, please try again later';
				}

				vm.isSubmitted = true;
				vm.isLoadingResults = false;
				angular.element('html, body').animate({
					scrollTop: topOfContent
				}, 250);
			});
		};

		var processEventData = function processEventData(data) {
			vm.data = data;
			vm.data.EventStartDate = $window.moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data, vm.data.EventLength, vm.data.AllDay);
			vm.shareUrl = emailUtilityService.getShareUrl(vm.data, $window.location.href);
			vm.shouldShowDisclaimer = ageDisclaimerService.shouldShowDisclaimer(vm.data);
			vm.disclaimer = CONSTANTS.ageDisclaimer.message;
			vm.downloadUrl = '' + CONSTANTS.baseUrl + CONSTANTS.serviceUrls.downloads + '/' + id;
		};

		eventsService.getById(id).then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$window', '$scope', '$routeParams', 'events.CONSTANTS', 'dataServices.eventsService', 'registrationService', 'dateUtilityService', 'emailUtilityService', 'downloadCalendarEventService', 'ageDisclaimerService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'), bcpl.utility.format);
'use strict';

(function (app, bootstrapCollapseHelper, onWindowResize, windowShade, globalConstants) {
	'use strict';

	var EventsPageCtrl = function EventsPageCtrl($document, $scope, $timeout, $animate, $location, $window, CONSTANTS, eventsService, filterHelperService, metaService, RequestModel) {
		setTimeout(function () {
			$window.scrollTo(0, 0); // Ensure the event details are visible on mobile
		}, 500);

		var vm = this;
		var filterTypes = ['locations', 'eventTypes', 'ageGroups'];

		var getStartDateLocaleString = function getStartDateLocaleString() {
			return $window.moment().format();
		};
		var getEndDateLocaleString = function getEndDateLocaleString() {
			return $window.moment().add(30, 'd').format();
		};

		/**
         * This contains the state of the filters on the page, this should match the most recent request, and results should be
         * visible on the page
         */
		vm.requestModel = new RequestModel();

		var eventDateBarStickySettings = {
			zIndex: 100,
			responsiveWidth: true
		};

		/* ** Public ** */
		vm.eventGroups = [];
		vm.keywords = '';
		vm.chunkSize = CONSTANTS.requestChunkSize;
		vm.totalResults = 0;
		vm.isLastPage = false;
		vm.areDatesInvalid = false;
		vm.isLoading = true;
		vm.hasResults = true;
		vm.data = {};

		vm.locations = [];
		vm.eventsTypes = [];
		vm.ageGroups = [];
		vm.isMobile = false;

		var updateMobileStatus = function updateMobileStatus() {
			vm.isMobile = $window.innerWidth <= globalConstants.breakpoints.medium;
			vm.filterCollapseUrl = vm.isMobile ? '#events-search-wrapper' : '';

			if (vm.isMobile) {
				vm.isFilterCollapseExpanded = false;
			}

			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};

		vm.toggleFilterCollapse = function () {
			vm.isFilterCollapseExpanded = !vm.isFilterCollapseExpanded;
		};

		updateMobileStatus(); // Set initial

		onWindowResize(updateMobileStatus); // bind to the resize event

		var getFilterPanelStatus = function getFilterPanelStatus(model) {
			var activePanels = [];
			var inActivePanels = [];
			if (model.Locations.length) {
				activePanels.push('locations');
			} else {
				inActivePanels.push('locations');
			}
			if (model.EventsTypes.length) {
				activePanels.push('eventTypes');
			} else {
				inActivePanels.push('eventTypes');
			}
			if (model.AgeGroups.length) {
				activePanels.push('ageGroups');
			} else {
				inActivePanels.push('ageGroups');
			}
			return {
				activePanels: activePanels,
				inActivePanels: inActivePanels
			};
		};

		vm.filterEvents = function (eventRequestModel, isInit, callback) {
			// Clear out existing list of events
			vm.eventGroups = [];

			// Let user know we are retreiving a new list of events
			vm.isLoading = true;
			vm.hasResults = true; // Do this to make sure the user doesn't see the no results message it will be updated below
			vm.requestErrorMessage = '';
			vm.requestModel = eventRequestModel;

			var startDatePicker = angular.element('#start-date')[0]._flatpickr; // eslint-disable-line 
			var endDatePicker = angular.element('#end-date')[0]._flatpickr; // eslint-disable-line 

			startDatePicker && startDatePicker.setDate($window.moment(eventRequestModel.StartDate).toDate()); // eslint-disable-line no-unused-expressions
			endDatePicker && endDatePicker.setDate($window.moment(eventRequestModel.EndDate).toDate()); // eslint-disable-line no-unused-expressions
			vm.userStartDate = $window.moment(eventRequestModel.StartDate).format('MMMM DD, YYYY');
			vm.userEndDate = $window.moment(eventRequestModel.EndDate).format('MMMM DD, YYYY');

			eventsService.get(eventRequestModel).then(function (events) {
				processEvents(events);

				vm.hasResults = !!getTotalResults(events);

				var filterPanelStatuses = getFilterPanelStatus(eventRequestModel);

				if (isInit) {
					bootstrapCollapseHelper.toggleCollapseByIds(filterPanelStatuses);
				} else {
					windowShade.cycleWithMessage('Event list updated!');
				}

				if (callback && typeof callback === 'function') {
					callback(events);
				}
			}).catch(handleFailedEventsGetRequest);
		};

		/** HELPERS */
		var getTotalResults = function getTotalResults(events) {
			return events && Object.prototype.hasOwnProperty.call(events, 'totalResults') ? events.totalResults : 0;
		};

		/** FILTER STUFF */
		vm.keywordSearch = function () {
			var newRequestModel = Object.assign({}, vm.requestModel);

			newRequestModel.Keyword = vm.keywords;
			newRequestModel.Page = 1;

			filterHelperService.setQueryParams([{
				key: 'term',
				val: vm.keywords
			}]); // This will trigger a location change, therefore getting the new results
		};

		vm.filterByDate = function () {
			vm.areDatesInvalid = !isDateRangeValid(vm.userStartDate, vm.userEndDate);

			if (!vm.areDatesInvalid) {
				var newRequestModel = Object.assign({}, vm.requestModel);

				newRequestModel.StartDate = vm.userStartDate;
				newRequestModel.EndDate = vm.userEndDate;
				newRequestModel.Page = 1;

				filterHelperService.setQueryParams([{
					key: 'startDate',
					val: vm.userStartDate
				}, {
					key: 'endDate',
					val: vm.userEndDate
				}]); // This will trigger a location change, therefore getting the new results
			}
		};

		vm.clearFilters = function () {
			resetRequestModel();

			resetUIFilterFields();

			filterHelperService.clearQueryParams();

			vm.filterEvents(vm.requestModel);
		};

		vm.loadNextPage = function () {
			var newRequestModel = Object.assign({}, vm.requestModel);
			newRequestModel.Page += 1;

			vm.requestModel = newRequestModel;

			// TODO: Realistically this should add a url here, too
			eventsService.get(newRequestModel).then(processAndCombineEvents).then(function () {
				$timeout(function () {
					$('.event-date-bar').sticky(eventDateBarStickySettings);
				});
			});
		};

		var setFilterData = function setFilterData(key, values) {
			if (!Object.prototype.hasOwnProperty.call(vm.data, key)) {
				// Only set this one time
				vm.data[key] = values;
			}
		};

		vm.filterByTerms = function (id, itemType, isChecked, filterVal) {
			var shouldUpdateLocation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

			var newRequestModel = Object.assign({}, vm.requestModel);

			switch (itemType.toLowerCase()) {
				case 'locations':
					toggleFilter(newRequestModel.Locations, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				case 'agegroups':
					toggleFilter(newRequestModel.AgeGroups, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				case 'eventtypes':
					toggleFilter(newRequestModel.EventsTypes, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				default:
					break;
			}

			vm.filterEvents(newRequestModel);
		};

		var handleFailedEventsGetRequest = function handleFailedEventsGetRequest() {
			vm.isLoading = false;
			vm.requestErrorMessage = 'There was a problem retrieving events. Please try again later.';
		};

		var toggleFilter = function toggleFilter(collection, id, shouldAddToCollection, filterKey, filterVal, shouldUpdateLocation) {
			if (shouldAddToCollection) {
				collection.push(id);
			} else {
				var indexOfId = collection.indexOf(id);

				if (indexOfId !== -1) {
					collection.splice(indexOfId, 1);
				}
			}

			if (shouldUpdateLocation) {
				filterHelperService.updateQueryParams([{
					key: filterKey,
					val: filterVal
				}]);
			}
		};

		var resetRequestModel = function resetRequestModel() {
			vm.requestModel = new RequestModel();
		};

		var resetUIFilterFields = function resetUIFilterFields() {
			vm.keywords = '';
			vm.userStartDate = '';
			vm.userEndDate = '';
		};

		/* ** Private ** */

		var processEvents = function processEvents(eventResults) {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.isLoading = false;
			vm.eventGroups = eventResults.eventGroups;
			vm.hasResults = eventResults.eventGroups.length;
			vm.requestErrorMessage = '';

			$timeout(function () {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			});
		};

		var processAndCombineEvents = function processAndCombineEvents(eventResults) {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = combineEventGroups(vm.eventGroups, eventResults.eventGroups);
		};

		var isLastPage = function isLastPage(totalResults) {
			var totalResultsSoFar = vm.requestModel.Page * vm.chunkSize;
			return totalResultsSoFar >= totalResults;
		};

		var isDateRangeValid = function isDateRangeValid(firstDate, secondDate) {
			if (firstDate && secondDate) {
				return $window.moment(firstDate).isSameOrBefore(secondDate);
			}
			return false;
		};

		var isSameDay = function isSameDay(day1Date, day2Date) {
			return day1Date && day2Date ? $window.moment(day1Date).isSame(day2Date, 'day') : false;
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

		var toggleIcon = function toggleIcon(collapseEvent) {
			var $collapsible = angular.element(collapseEvent.currentTarget);
			var $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		var getKeywords = function getKeywords() {
			return $location.search().term && $location.search().term.length ? $location.search().term : '';
		};

		/* ** Init ** */
		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		var getFilterId = function getFilterId(filterType, val) {
			if (!val) return -1;

			var filterTypeExists = Object.prototype.hasOwnProperty.call(vm.data, filterType);

			if (filterTypeExists) {
				var matchedFilters = vm.data[filterType].filter(function (filter) {
					return Object.prototype.hasOwnProperty.call(filter, 'Name') && filter.Name.toLowerCase().trim() === val.toLowerCase().trim();
				});

				if (filterType === 'locations') {
					return matchedFilters.length ? matchedFilters[0].LocationId : null;
				}
				return matchedFilters.length ? matchedFilters[0].Id : null;
			}

			return -1;
		};

		var isEmptyObject = function isEmptyObject(obj) {
			return Object.keys(obj).length === 0 && obj.constructor === Object;
		};
		var isFilterADate = function isFilterADate(filterType) {
			return filterType && filterType.toLowerCase().indexOf('date') > -1;
		};
		var upperCaseFirstLetter = function upperCaseFirstLetter(word) {
			return word.replace(/^\w/, function (chr) {
				return chr.toUpperCase();
			});
		};

		var getRequestModelBasedOnQueryParams = function getRequestModelBasedOnQueryParams() {
			var newRequestModel = Object.assign({}, vm.requestModel);
			var queryParams = filterHelperService.getQueryParams();

			if (isEmptyObject(queryParams)) {
				resetUIFilterFields();
				return vm.requestModel;
			}

			// Build the request model

			// Keywords
			var keywords = getKeywords();
			newRequestModel.Keyword = keywords;
			vm.keywords = keywords;

			// Dates
			var requestDates = getDatesFromUrl(queryParams);

			if (requestDates) {
				newRequestModel.StartDate = requestDates.startDate;
				newRequestModel.EndDate = requestDates.endDate;
			}

			// Lists
			var queryParamKeys = Object.keys(queryParams);

			queryParamKeys.forEach(function (filterType) {
				var isFilterTypeDate = isFilterADate(filterType);

				if (!isFilterTypeDate) {
					var filterValStr = queryParams[filterType];
					var filterValues = filterHelperService.getFiltersFromString(filterValStr);

					filterValues.forEach(function (filterVal) {
						var filterId = getFilterId(filterType, filterVal);

						if (filterId && filterId > -1) {
							var requestModelKey = upperCaseFirstLetter(filterType);

							if (requestModelKey.indexOf('EventTypes') > -1) {
								requestModelKey = 'EventsTypes';
							}

							newRequestModel[requestModelKey] = getFilterArray(newRequestModel[requestModelKey], filterId);
						}
					});
				}
			});

			return newRequestModel;
		};

		var getFilterArray = function getFilterArray(targetFilterArray, targetVal) {
			var newArray = targetFilterArray ? targetFilterArray.slice() : [];
			var doesTargetValueExist = targetFilterArray && targetFilterArray.length && targetFilterArray.includes(targetVal);

			if (doesTargetValueExist) {
				newArray = targetFilterArray.filter(function (x) {
					return x !== targetVal;
				});
			} else {
				newArray.push(targetVal);
			}

			return newArray;
		};

		var filterDataSuccessHandler = function filterDataSuccessHandler(data, filterType, callback) {
			setFilterData(filterType, data);

			if (callback && typeof callback === 'function') {
				callback();
			}
		};

		var filterDataErrorHandler = function filterDataErrorHandler(error, callback) {
			if (callback && typeof callback === 'function') {
				callback(error);
			}
		};

		// We need to load these on the page first, so that we can use that data
		var setupListFilters = function setupListFilters(successCallback, errorCallback) {
			var url = void 0;
			var counter = 0;

			filterTypes.forEach(function (filterType) {
				if (CONSTANTS.remoteServiceUrls[filterType]) {
					url = CONSTANTS.remoteServiceUrls[filterType];
				} else if (CONSTANTS.serviceUrls[filterType]) {
					url = '' + CONSTANTS.baseUrl + CONSTANTS.serviceUrls[filterType];
				}

				metaService.request(url).then(function (data) {
					return filterDataSuccessHandler(data, filterType, function () {
						counter += 1;

						if (counter === filterTypes.length) {
							successCallback();
						}
					});
				}, function (error) {
					return filterDataErrorHandler(error, errorCallback);
				});
			});
		};

		var getDatesFromUrl = function getDatesFromUrl(queryParams) {
			var userStartDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'startDate', true);
			var userEndDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'endDate', true);

			if (userStartDate || userEndDate) {
				vm.userStartDate = userStartDate;
				vm.userEndDate = userEndDate;

				return {
					startDate: userStartDate || getStartDateLocaleString(),
					endDate: userEndDate || getEndDateLocaleString()
				};
			}
			return null;
		};

		var updateResultsBasedOnFilters = function updateResultsBasedOnFilters(isInit) {
			var newRequestModel = getRequestModelBasedOnQueryParams();

			vm.filterEvents(newRequestModel, isInit);
		};

		var initErrorCallback = function initErrorCallback() {
			return eventsService.get(vm.requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
		};

		var init = function init() {
			// setupListFilters sets the data to the view model
			setupListFilters(function () {
				updateResultsBasedOnFilters(true);
			}, initErrorCallback);
		};

		var isDetailsPage = function isDetailsPage(url) {
			return (/(?!.*\?.*$)(^.*\/\d{6,}$)/g.test(url)
			);
		};

		$scope.$on('$locationChangeSuccess', function () {
			for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
				params[_key] = arguments[_key];
			}

			var destinationUrl = params && params.length >= 2 ? params[1] : '';

			// This prevents the filter updated message from running on the details page
			if (!isDetailsPage(destinationUrl)) {
				resetRequestModel();
				updateResultsBasedOnFilters();
			}
		});

		init();
	};

	EventsPageCtrl.$inject = ['$document', '$scope', '$timeout', '$animate', '$location', '$window', 'events.CONSTANTS', 'dataServices.eventsService', 'sharedFilters.filterHelperService', 'metaService', 'RequestModel'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'), bcpl.boostrapCollapseHelper, bcpl.utility.windowResize, bcpl.utility.windowShade, bcpl.constants);
'use strict';

(function (app) {
	'use strict';

	var datePickersDirective = function datePickersDirective($timeout, $window, CONSTANTS) {
		var datePickersLink = function datePickersLink(scope, attr, datePickersElement) {
			var innerScope = scope;
			var getStartDateLocaleString = function getStartDateLocaleString() {
				return $window.moment().format();
			};
			var getEndDateLocaleString = function getEndDateLocaleString() {
				return $window.moment().add(30, 'd').format();
			};

			innerScope.areDatesInvalid = false;

			var flatpickrBasicSettings = {
				dateFormat: 'F d, Y',
				disable: [function disable(date) {
					return $window.moment(date).isBefore(new Date(), 'day');
				}],
				onChange: function onChange() {
					$timeout(function () {
						innerScope.userStartDate = innerScope.userStartDate || getStartDateLocaleString();
						innerScope.userEndDate = innerScope.userEndDate || getEndDateLocaleString();

						$timeout(function () {
							if ($window.moment(innerScope.userStartDate).isSameOrBefore(innerScope.userEndDate)) {
								innerScope.areDatesInvalid = false;
								innerScope.filterByDate();
							} else {
								innerScope.areDatesInvalid = true;
							}
						});
					});
				}
			};

			innerScope.openFlatpickr = function (flatpickrElementId) {
				var flatpickr = document.querySelector('#' + flatpickrElementId)._flatpickr; // eslint-disable-line no-underscore-dangle
				flatpickr.open();
			};

			angular.element(document).ready(function () {
				$window.flatpickr('#start-date, #end-date', flatpickrBasicSettings);
			});
		};

		var directive = {
			link: datePickersLink,
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.datePickersTemplate,
			scope: {
				userStartDate: '=startDateModel',
				userEndDate: '=endDateModel',
				filterByDate: '=filterByDate'
			}
		};

		return directive;
	};

	datePickersDirective.$inject = ['$timeout', '$window', 'events.CONSTANTS'];

	app.directive('datePickers', datePickersDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var eventsListDirective = function eventsListDirective($timeout, CONSTANTS, dateUtilityService, ageDisclaimerService) {
		var eventsListLink = function eventsListLink(scope) {
			var innerScope = scope;

			var dateSettings = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			innerScope.eventScheduleString = function (eventItem) {
				return dateUtilityService.formatSchedule(eventItem, eventItem.EventLength, eventItem.AllDay);
			};

			innerScope.getDisplayDate = function (eventGroup) {
				return eventGroup.date.toLocaleDateString('en-US', dateSettings);
			};

			innerScope.shouldShowDisclaimer = ageDisclaimerService.shouldShowDisclaimer;

			innerScope.disclaimer = CONSTANTS.ageDisclaimer.message;
		};

		var directive = {
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.eventsListTemplate,
			link: eventsListLink,
			scope: {
				eventGroups: '='
			}
		};

		return directive;
	};

	eventsListDirective.$inject = ['$timeout', 'events.CONSTANTS', 'dateUtilityService', 'ageDisclaimerService'];

	app.directive('eventsList', eventsListDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective(metaService, CONSTANTS) {
		var filtersLink = function filtersLink(scope) {
			var innerScope = scope;

			innerScope.search = function (searchItem, termType, isChecked) {
				var identifier = searchItem.item.Id || searchItem.item.LocationId;
				var name = searchItem.item.Name || searchItem.item.Id;
				innerScope.searchFunction(identifier, termType, isChecked, name, innerScope.items);
			};

			innerScope.removeDisallowedCharacters = function (str) {
				var disallowedCharactersRegex = /[^A-Za-z0-9-_.]/g;

				return str.trim().replace(disallowedCharactersRegex, '-');
			};

			innerScope.isFilterChecked = function (filterType, item) {
				var targetId = filterType && filterType === 'locations' ? item.LocationId : item.Id;

				return innerScope.activeFilters ? innerScope.activeFilters.includes(targetId) : false;
			};
		};

		var directive = {
			link: filtersLink,
			restrict: 'E',
			scope: {
				filterType: '@',
				choiceType: '@',
				searchFunction: '=',
				items: '=',
				activeFilters: '='
			},
			templateUrl: CONSTANTS.templateUrls.filtersExpandosTemplate
		};

		return directive;
	};

	filtersDirective.$inject = ['metaService', 'events.CONSTANTS'];

	app.directive('filtersExpandos', filtersDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective(metaService, CONSTANTS) {
		var filtersLink = function filtersLink(scope) {
			var innerScope = scope;

			innerScope.search = function (searchItem, termType, isChecked) {
				var identifier = searchItem.item.Id || searchItem.item.LocationId;
				innerScope.searchFunction(identifier, termType, isChecked);
			};

			innerScope.removeDisallowedCharacters = function (str) {
				var disallowedCharactersRegex = /[^A-Za-z0-9-_.]/g;

				return str.trim().replace(disallowedCharactersRegex, '-');
			};

			innerScope.isFilterChecked = function (filterType, item) {
				var targetId = filterType && filterType === 'locations' ? item.LocationId : item.Id;

				return innerScope.activeFilters.includes(targetId);
			};
		};

		var directive = {
			link: filtersLink,
			restrict: 'E',
			scope: {
				filterType: '@',
				choiceType: '@',
				searchFunction: '=',
				activeFilters: '='
			},
			templateUrl: CONSTANTS.templateUrls.filtersTemplate
		};

		return directive;
	};

	filtersDirective.$inject = ['metaService', 'events.CONSTANTS'];

	app.directive('filters', filtersDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

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

	loadMoreDirective.$inject = ['events.CONSTANTS'];

	app.directive('loadMore', loadMoreDirective);
})(angular.module('eventsPageApp'));