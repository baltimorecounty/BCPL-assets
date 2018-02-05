'use strict';

(function () {
	'use strict';

	angular.module('eventsPageApp', ['ngRoute', 'ngSanitize']);
})();
'use strict';

(function (app) {
	'use strict';

	var constants = {
		//'baseUrl: 'https://testservices.bcpl.info',
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

	var EventDetailsCtrl = function EventsPageCtrl($scope, $timeout, $routeParams, CONSTANTS, eventsService, dateUtilityService) {
		var self = this;
		var id = $routeParams.id;

		self.data = {};
		self.data.EventStartDate = '';
		self.data.EventStartTime = '';
		self.data.EventEndTime = '';

		var processEventData = function processEventData(data) {
			self.data = data;
			self.data.EventStartDate = moment(self.data.EventStart).format('MMMM D, YYYY');
			self.data.EventSchedule = dateUtilityService.formatSchedule(self.data.EventStart, self.data.EventLength);
			self.isRegistrationRequired = self.data.RegistrationTypeCodeEnum !== 0;
			self.isOver = moment().isAfter(moment(self.data.EventStart).add(self.data.EventLength, 'm'));
		};

		eventsService.getById(id).then(processEventData);
	};

	EventDetailsCtrl.$inject = ['$scope', '$timeout', '$routeParams', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var EventRegistrationCtrl = function EventsPageCtrl($window, $scope, $routeParams, eventsService, registrationService, dateUtilityService) {
		var id = $routeParams.id;

		var vm = this;

		vm.isGroup = 'false';
		vm.isSubmitted = false;
		vm.isLoadingResults = false;

		vm.submitHandler = function () {
			vm.isLoadingResults = true;

			var postModel = {
				EventId: parseInt(id, 10),
				FirstName: vm.firstName,
				LastName: vm.lastName,
				Email: vm.email,
				Phone: vm.phone,
				IsGroup: vm.isGroup === 'true',
				GroupCount: vm.groupCount
			};

			registrationService.register(postModel).then(function (postResult) {
				// jQuery since ngAnimate can't do this.
				var topOfContent = angular.element('.main-content').first().offset().top;

				vm.postResult = postResult.data;
				vm.isSubmitted = true;
				vm.isLoadingResults = false;
				angular.element('html, body').animate({ scrollTop: topOfContent }, 250);
			});
		};

		var processEventData = function processEventData(data) {
			vm.data = data;
			vm.data.EventSchedule = dateUtilityService.formatSchedule(vm.data.EventStart, vm.data.EventLength);
		};

		eventsService.getById(id).then(processEventData);
	};

	EventRegistrationCtrl.$inject = ['$window', '$scope', '$routeParams', 'eventsService', 'registrationService', 'dateUtilityService'];

	app.controller('EventRegistrationCtrl', EventRegistrationCtrl);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var EventsPageCtrl = function EventsPageCtrl($scope, $timeout, $animate, CONSTANTS, eventsService) {
		var self = this;
		var firstPage = 1;
		var startDateLocaleString = moment().format();
		var endDate = moment().add(30, 'd');
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

		self.eventGroups = [];
		self.keywords = '';
		self.chunkSize = CONSTANTS.requestChunkSize;
		self.totalResults = 0;
		self.isLastPage = false;
		self.areDatesInvalid = false;
		self.isLoading = true;
		self.hasResults = true;

		self.locations = requestModel.Locations;
		self.eventsTypes = requestModel.EventsTypes;
		self.ageGroups = requestModel.AgeGroups;

		self.keywordSearch = function () {
			requestModel.Keyword = self.keywords;
			requestModel.StartDate = startDateLocaleString;
			requestModel.Page = 1;
			self.eventGroups = [];
			self.hasResults = true;
			self.isLoading = true;

			eventsService.get(requestModel).then(processEvents);
		};

		self.filterByDate = function () {
			self.areDatesInvalid = !isDateRangeValid(self.userStartDate, self.userEndDate);
			if (!self.areDatesInvalid) {
				requestModel.StartDate = self.userStartDate;
				requestModel.EndDate = self.userEndDate;
				requestModel.Page = 1;
				self.eventGroups = [];
				self.hasResults = true;
				self.isLoading = true;

				eventsService.get(requestModel).then(processEvents);
			}
		};

		self.filterByTerms = function (id, itemType, isChecked) {
			switch (itemType.toLowerCase()) {
				case 'locations':
					toggleFilter(requestModel.Locations, id, isChecked);
					break;
				case 'agegroups':
					toggleFilter(requestModel.AgeGroups, id, isChecked);
					break;
				case 'eventtypes':
					toggleFilter(requestModel.EventsTypes, id, isChecked);
					break;
				default:
					break;
			}

			self.eventGroups = [];
			self.hasResults = true;
			self.isLoading = true;

			eventsService.get(requestModel).then(processEvents);
		};

		var toggleFilter = function toggleFilter(collection, id, shouldAddToCollection) {
			if (shouldAddToCollection) {
				collection.push(id);
			} else {
				var indexOfId = collection.indexOf(id);

				if (indexOfId !== -1) {
					collection.splice(indexOfId, 1);
				}
			}
		};

		self.loadNextPage = function () {
			requestModel.Page += 1;

			eventsService.get(requestModel).then(processAndCombineEvents).then(function () {
				$timeout(function () {
					$('.event-date-bar').sticky(eventDateBarStickySettings);
				});
			});
		};

		self.clearFilters = function () {
			requestModel.StartDate = startDateLocaleString;
			requestModel.EndDate = endDateLocaleString;
			requestModel.Page = 1;
			requestModel.Keyword = '';
			requestModel.AgeGroups = [];
			requestModel.EventsTypes = [];
			requestModel.Locations = [];

			self.keywords = '';
			self.userStartDate = '';
			self.userEndDate = '';
			self.eventGroups = [];
			self.hasResults = true;
			self.isLoading = true;
			self.locations = requestModel.Locations;
			self.eventsTypes = requestModel.EventsTypes;
			self.ageGroups = requestModel.AgeGroups;

			eventsService.get(requestModel).then(processEvents);
		};

		/* ** Private ** */

		var processEvents = function processEvents(eventResults) {
			self.isLastPage = isLastPage(eventResults.totalResults);
			self.eventGroups = eventResults.eventGroups;
			self.isLoading = false;
			self.hasResults = eventResults.eventGroups.length;

			$timeout(function () {
				$('.event-date-bar').sticky(eventDateBarStickySettings);
			});
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

		var toggleIcon = function toggleIcon(collapseEvent) {
			var $collapsible = angular.element(collapseEvent.currentTarget);
			var $collapseIcon = $collapsible.closest('.expando-wrapper').find('i');
			$collapseIcon.toggleClass('fa-plus-square').toggleClass('fa-minus-square');
		};

		/* ** Init ** */

		angular.element(document).on('hide.bs.collapse', '.expando-wrapper .collapse', toggleIcon);
		angular.element(document).on('show.bs.collapse', '.expando-wrapper .collapse', toggleIcon);

		eventsService.get(requestModel).then(processEvents);
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', '$animate', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
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

	datePickersDirective.$inject = ['$timeout', 'CONSTANTS'];

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
				return dateUtilityService.formatSchedule(eventItem.EventStart, eventItem.EventLength);
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

	eventsListDirective.$inject = ['$timeout', 'CONSTANTS', 'dateUtilityService'];

	app.directive('eventsList', eventsListDirective);
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
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective(metaService, CONSTANTS) {
		var filtersLink = function filtersLink(scope) {
			var innerScope = scope;

			var filterSuccess = function filterSuccess(data) {
				innerScope.items = data;
			};

			innerScope.search = function (searchItem, termType, isChecked) {
				var identifier = searchItem.item.Id || searchItem.item.LocationId;
				innerScope.searchFunction(identifier, termType, isChecked);
			};

			innerScope.removeDisallowedCharacters = function (str) {
				var disallowedCharactersRegex = /[^A-Za-z0-9-_.]/g;

				return str.trim().replace(disallowedCharactersRegex, '-');
			};

			innerScope.items = [];

			if (CONSTANTS.remoteServiceUrls[innerScope.filterType]) {
				metaService.request(CONSTANTS.remoteServiceUrls[innerScope.filterType]).then(filterSuccess);
			}
		};

		var directive = {
			link: filtersLink,
			restrict: 'E',
			scope: {
				filterType: '@',
				choiceType: '@',
				searchFunction: '='
			},
			templateUrl: CONSTANTS.templateUrls.filtersExpandosTemplate
		};

		return directive;
	};

	filtersDirective.$inject = ['metaService', 'CONSTANTS'];

	app.directive('filtersExpandos', filtersDirective);
})(angular.module('eventsPageApp'));
'use strict';

(function (app) {
	'use strict';

	var filtersDirective = function filtersDirective(metaService, CONSTANTS) {
		var filtersLink = function filtersLink(scope) {
			var innerScope = scope;

			var filterSuccess = function filterSuccess(data) {
				innerScope.items = data;
			};

			innerScope.search = function (searchItem, termType, isChecked) {
				var identifier = searchItem.item.Id || searchItem.item.LocationId;
				innerScope.searchFunction(identifier, termType, isChecked);
			};

			innerScope.removeDisallowedCharacters = function (str) {
				var disallowedCharactersRegex = /[^A-Za-z0-9-_.]/g;

				return str.trim().replace(disallowedCharactersRegex, '-');
			};

			innerScope.items = [];

			if (CONSTANTS.remoteServiceUrls[innerScope.filterType]) {
				metaService.request(CONSTANTS.remoteServiceUrls[innerScope.filterType]).then(filterSuccess);
			}
		};

		var directive = {
			link: filtersLink,
			restrict: 'E',
			scope: {
				filterType: '@',
				choiceType: '@',
				searchFunction: '='
			},
			templateUrl: CONSTANTS.templateUrls.filtersTemplate
		};

		return directive;
	};

	filtersDirective.$inject = ['metaService', 'CONSTANTS'];

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

	loadMoreDirective.$inject = ['CONSTANTS'];

	app.directive('loadMore', loadMoreDirective);
})(angular.module('eventsPageApp'));