'use strict';

(function () {
	'use strict';

	var app = angular.module('sharedFilters', []);

	var filterHelpers = function filterHelpers($location) {
		var clearQueryParams = function clearQueryParams(key) {
			var newQueryParams = {};

			if (key) {
				var queryParams = $location.search();
				delete queryParams[key];
				newQueryParams = queryParams;
			}

			$location.search(newQueryParams);
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

		var setQueryParams = function setQueryParams(key, val) {
			if (!key) return;

			var queryParam = $location.search();
			queryParam[key] = val;

			$location.search(queryParam);
		};

		var updateQueryParams = function updateQueryParams(key, val) {
			var queryParams = getQueryParams();
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
					clearQueryParams(key);
				} else {
					setQueryParams(key, newFilterValues.join(','));
				}
			} else {
				setQueryParams(key, val);
			}
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
	var toggleCollapseById = function toggleCollapseById(id) {
		$('#' + id).collapse('toggle');
	};

	return {
		toggleCollapseById: toggleCollapseById
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
		baseUrl: 'https://testservices.bcpl.info',
		// baseUrl: 'http://oit226696:3100',
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

	var config = function config($routeProvider, CONSTANTS) {
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

	config.$inject = ['$routeProvider', 'events.CONSTANTS'];

	app.config(config);
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

		var formatSchedule = function formatSchedule(eventStart, eventLength, isAllDay) {
			if (isAllDay) return 'All Day';

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

	var EventDetailsCtrl = function EventsPageCtrl($scope, $timeout, $routeParams, CONSTANTS, eventsService, dateUtilityService) {
		var vm = this;
		var id = $routeParams.id;

		vm.data = {};
		vm.data.EventStartDate = '';
		vm.data.EventStartTime = '';
		vm.data.EventEndTime = '';
		vm.isLoading = true;
		vm.isError = false;
		vm.requestErrorMessage = 'Unfortunately, there was a problem loading this event\'s details. Please try again in a few minutes.';

		var processEventData = function processEventData(data) {
			vm.data = data;
			vm.data.EventStartDate = moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength, vm.data.AllDay);
			vm.isRegistrationRequired = vm.data.RegistrationTypeCodeEnum !== 0;
			vm.isOver = moment().isAfter(moment(vm.data.EventStart).add(vm.data.EventLength, 'm'));
			vm.isLoading = false;
		};

		var requestError = function requestError(errorResponse) {
			vm.isLoading = false;
			vm.isError = true;
		};

		eventsService.getById(id).then(processEventData).catch(requestError);
	};

	EventDetailsCtrl.$inject = ['$scope', '$timeout', '$routeParams', 'events.CONSTANTS', 'dataServices.eventsService', 'dateUtilityService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app, bcFormat) {
	'use strict';

	var EventRegistrationCtrl = function EventsPageCtrl($window, $scope, $routeParams, eventsService, registrationService, dateUtilityService) {
		var id = $routeParams.id;

		var vm = this;

		vm.isGroup = 'false';
		vm.isSubmitted = false;
		vm.isLoadingResults = false;
		vm.formConfirmationMessage = null;

		vm.submitHandler = function () {
			vm.isLoadingResults = true;

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
				var hasConfirmationMessage = data && Object.prototype.hasOwnProperty.call(data, 'ConfirmationMessage') && data.ConfirmationMessage && data.ConfirmationMessage.length;

				if (hasConfirmationMessage) {
					vm.formConfirmationMessage = data.ConfirmationMessage;
				} else {
					var hasErrors = vm.postResult && Object.prototype.hasOwnProperty.call(vm.postResult, 'Errors') && vm.postResult.Errors.length;

					vm.formConfirmationMessage = hasErrors ? vm.postResult.Errors[0].Error : 'Something went wrong, please try again later';
				}

				vm.isSubmitted = true;
				vm.isLoadingResults = false;
				angular.element('html, body').animate({ scrollTop: topOfContent }, 250);
			});
		};

		var processEventData = function processEventData(data) {
			vm.data = data;
			vm.data.EventStartDate = moment(vm.data.EventStart).format('MMMM D, YYYY');
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength, vm.data.AllDay);
		};

		eventsService.getById(id).then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$window', '$scope', '$routeParams', 'dataServices.eventsService', 'registrationService', 'dateUtilityService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'), bcpl.utility.format);
'use strict';

(function (app, bootstrapCollapseHelper) {
	'use strict';

	var EventsPageCtrl = function EventsPageCtrl($scope, $timeout, $animate, $location, $window, CONSTANTS, eventsService, filterHelperService, metaService) {
		var vm = this;
		var firstPage = 1;
		var startDateLocaleString = $window.moment().format();
		var endDate = $window.moment().add(30, 'd');
		var endDateLocaleString = endDate.format();
		var requestModel = {
			StartDate: startDateLocaleString,
			EndDate: endDateLocaleString,
			Page: firstPage,
			IsOngoingVisible: true,
			IsSpacesReservationVisible: false,
			Limit: CONSTANTS.requestChunkSize,
			EventsTypes: [],
			AgeGroups: [],
			Locations: []
		};
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

		vm.locations = requestModel.Locations;

		vm.eventsTypes = requestModel.EventsTypes;
		vm.ageGroups = requestModel.AgeGroups;

		vm.keywordSearch = function () {
			requestModel.Keyword = vm.keywords;
			requestModel.StartDate = startDateLocaleString;
			requestModel.Page = 1;
			vm.eventGroups = [];
			vm.hasResults = true;
			vm.isLoading = true;

			updateFilterUrl('term', vm.keywords);

			eventsService.get(requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
		};

		var updateFilterUrl = function updateFilterUrl(targetKey, vmModel) {
			if (vmModel) {
				filterHelperService.setQueryParams(targetKey, vmModel);
			} else {
				filterHelperService.clearQueryParams(targetKey);
			}
		};

		vm.filterByDate = function () {
			vm.areDatesInvalid = !isDateRangeValid(vm.userStartDate, vm.userEndDate);

			if (!vm.areDatesInvalid) {
				requestModel.StartDate = vm.userStartDate;
				requestModel.EndDate = vm.userEndDate;
				requestModel.Page = 1;
				vm.eventGroups = [];
				vm.hasResults = true;
				vm.isLoading = true;
				vm.requestErrorMessage = '';

				updateFilterUrl('startDate', vm.userStartDate);
				updateFilterUrl('endDate', vm.userEndDate);

				eventsService.get(requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
			}
		};

		var setFilterData = function setFilterData(key, values) {
			if (!Object.prototype.hasOwnProperty.call(vm.data, key)) {
				// Only set this one time
				vm.data[key] = values;
			}
		};

		vm.filterByTerms = function (id, itemType, isChecked, filterVal) {
			var shouldUpdateLocation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

			switch (itemType.toLowerCase()) {
				case 'locations':
					toggleFilter(requestModel.Locations, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				case 'agegroups':
					toggleFilter(requestModel.AgeGroups, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				case 'eventtypes':
					toggleFilter(requestModel.EventsTypes, id, isChecked, itemType, filterVal, shouldUpdateLocation);
					break;
				default:
					break;
			}

			vm.eventGroups = [];
			vm.hasResults = true;
			vm.isLoading = true;

			eventsService.get(requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
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
				filterHelperService.updateQueryParams(filterKey, filterVal);
			}
		};

		vm.loadNextPage = function () {
			requestModel.Page += 1;

			eventsService.get(requestModel).then(processAndCombineEvents).then(function () {
				$timeout(function () {
					$('.event-date-bar').sticky(eventDateBarStickySettings);
				});
			});
		};

		vm.clearFilters = function () {
			requestModel.StartDate = startDateLocaleString;
			requestModel.EndDate = endDateLocaleString;
			requestModel.Page = 1;
			requestModel.Keyword = '';
			requestModel.AgeGroups = [];
			requestModel.EventsTypes = [];
			requestModel.Locations = [];

			vm.keywords = '';
			vm.userStartDate = '';
			vm.userEndDate = '';
			vm.eventGroups = [];
			vm.hasResults = true;
			vm.isLoading = true;
			vm.locations = requestModel.Locations;
			vm.eventsTypes = requestModel.EventsTypes;
			vm.ageGroups = requestModel.AgeGroups;

			filterHelperService.clearQueryParams();

			eventsService.get(requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
		};

		/* ** Private ** */

		var processEvents = function processEvents(eventResults) {
			vm.isLastPage = isLastPage(eventResults.totalResults);
			vm.eventGroups = eventResults.eventGroups;
			vm.isLoading = false;
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
			var totalResultsSoFar = requestModel.Page * vm.chunkSize;
			return totalResultsSoFar >= totalResults;
		};

		var isDateRangeValid = function isDateRangeValid(firstDate, secondDate) {
			if (firstDate && secondDate) {
				return $window.moment(firstDate).isSameOrBefore(secondDate);
			}

			return false;
		};

		var isSameDay = function isSameDay(day1Date, day2Date) {
			if (day1Date && day2Date) {
				return $window.moment(day1Date).isSame(day2Date, 'day');
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

		var setFiltersBasedOnQueryParams = function setFiltersBasedOnQueryParams() {
			var queryParams = filterHelperService.getQueryParams();

			setDatesFromUrl(queryParams);

			Object.keys(queryParams).forEach(function (queryParamKey) {
				var filterType = queryParamKey;
				var isFilterTypeDate = filterType && filterType.toLowerCase().indexOf('date') > -1;

				if (!isFilterTypeDate) {
					var filterValStr = queryParams[queryParamKey];
					var filterValues = filterHelperService.getFiltersFromString(filterValStr);

					filterValues.forEach(function (filterVal) {
						var filterId = getFilterId(filterType, filterVal);

						if (filterId && filterId > -1) {
							vm.filterByTerms(filterId, filterType, true, filterVal, false);
						}
					});

					bootstrapCollapseHelper.toggleCollapseById(filterType);
				}
			});
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

		var setIntialFilterData = function setIntialFilterData(successCallback, errorCallback) {
			var filterTypes = ['locations', 'eventTypes', 'ageGroups'];
			var url = void 0;

			filterTypes.forEach(function (filterType, index) {
				if (CONSTANTS.remoteServiceUrls[filterType]) {
					url = CONSTANTS.remoteServiceUrls[filterType];
				} else if (CONSTANTS.serviceUrls[filterType]) {
					url = '' + CONSTANTS.baseUrl + CONSTANTS.serviceUrls[filterType];
				}

				metaService.request(url).then(function (data) {
					return filterDataSuccessHandler(data, filterType, function () {
						if (index === filterTypes.length - 1) {
							successCallback();
						}
					});
				}, function (error) {
					return filterDataErrorHandler(error, errorCallback);
				});
			});
		};

		var setDatesFromUrl = function setDatesFromUrl(queryParams) {
			var userStartDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'startDate', true);
			var userEndDate = filterHelperService.getQueryParamValuesByKey(queryParams, 'endDate', true);

			if (userStartDate && userEndDate) {
				vm.userStartDate = userStartDate;
				vm.userEndDate = userEndDate;

				vm.filterByDate();
			}
		};

		var initSuccessCallback = function initSuccessCallback() {
			setFiltersBasedOnQueryParams();

			var keywords = getKeywords();

			if (keywords) {
				vm.keywords = keywords;
				vm.keywordSearch();
			} else {
				eventsService.get(requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
			}
		};

		var initErrorCallback = function initErrorCallback() {
			return eventsService.get(requestModel).then(processEvents).catch(handleFailedEventsGetRequest);
		};

		var init = function init() {
			// setIntialFilterData sets the data to the view model
			setIntialFilterData(initSuccessCallback, initErrorCallback);
		};

		init();
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', '$animate', '$location', '$window', 'events.CONSTANTS', 'dataServices.eventsService', 'sharedFilters.filterHelperService', 'metaService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'), bcpl.boostrapCollapseHelper);
'use strict';

(function (app) {
	'use strict';

	var datePickersDirective = function datePickersDirective($timeout, CONSTANTS) {
		var datePickersLink = function datePickersLink(scope, attr, datePickersElement) {
			var innerScope = scope;

			innerScope.areDatesInvalid = false;

			var flatpickrBasicSettings = {
				dateFormat: 'F d, Y',
				disable: [function disable(date) {
					return moment(date).isBefore(new Date(), 'day');
				}],
				onChange: function onChange() {
					$timeout(function () {
						innerScope.userStartDate = innerScope.userStartDate || innerScope.userEndDate;
						innerScope.userEndDate = innerScope.userEndDate || innerScope.userStartDate;

						$timeout(function () {
							if (moment(innerScope.userStartDate).isSameOrBefore(innerScope.userEndDate)) {
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

			flatpickr('#start-date, #end-date', flatpickrBasicSettings);
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

	datePickersDirective.$inject = ['$timeout', 'events.CONSTANTS'];

	app.directive('datePickers', datePickersDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var eventsListDirective = function eventsListDirective($timeout, CONSTANTS, dateUtilityService) {
		var eventsListLink = function eventsListLink(scope) {
			var innerScope = scope;

			var dateSettings = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			innerScope.eventScheduleString = function (eventItem) {
				return dateUtilityService.formatSchedule(eventItem.EventStart, eventItem.EventLength, eventItem.AllDay);
			};

			innerScope.getDisplayDate = function (eventGroup) {
				return eventGroup.date.toLocaleDateString('en-US', dateSettings);
			};
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

	eventsListDirective.$inject = ['$timeout', 'events.CONSTANTS', 'dateUtilityService'];

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