((moment) => {
	'use strict';

	const registrationIsRequiredCode = 1;
	const app = angular.module('dataServices', []);

	const eventsService = (CONSTANTS, $http, $q) => {
		const isEventOnDate = (eventItem, eventDate) => {
			const eventItemStartDateLocaleString = (new Date(eventItem.EventStart)).toLocaleDateString();

			return eventItemStartDateLocaleString === eventDate;
		};

		const dateSplitter = (eventData) => {
			let eventsByDate = [];
			let lastEventDateLocaleString;

			angular.forEach(eventData, (eventItem) => {
				const fixedEvent = eventItem.EventStart ? eventItem : setStartDateForOnGoingEvent(eventItem, moment());

				let eventStartDateLocaleString = (new Date(fixedEvent.EventStart)).toLocaleDateString();

				if (lastEventDateLocaleString !== eventStartDateLocaleString) {
					const eventDate = fixedEvent.EventStart || fixedEvent.OnGoingStartDate;
					eventsByDate.push({
						date: new Date(eventDate),
						events: eventGroupSorter(eventData.filter((thisEvent) => isEventOnDate(thisEvent, eventStartDateLocaleString)))
					});

					lastEventDateLocaleString = eventStartDateLocaleString;
				}
			});

			return eventsByDate;
		};

		const sortSplitEventsByEventStart = (eventGroup) => {
			return eventGroup.sort(eventGroupSorter);
		};

		const eventGroupSorter = (eventItemA, eventItemB) => {
			if (moment(eventItemA.EventStart).isSame(eventItemB.EventStart, 'minute')) {
				return 0;
			}

			if (moment(eventItemA.EventStart).isBefore(eventItemB.EventStart)) {
				return 1;
			}

			return -1;
		};

		const get = (eventRequestModel) => {
			return $q((resolve, reject) => {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel)
					.then((response) => {
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

		const getById = (id) => {
			return $q((resolve, reject) => {
				$http.get(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events + '/' + id)
					.then((response) => {
						if (response.data) {
							if (response.data.Description) {
								response.data.Description = response.data.Description.replace(/<[\w/]+>/g, '');
							}

							const momentDateFormat = 'M/D/YYYY @ h:mm a';
							const momentDayFormat = 'M/D/YYYY';

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

		const formatTime = unformattedTime => {
			return unformattedTime.replace(':00', '').replace(/\w\w$/, foundString => foundString.split('').join('.') + '.');
		};

		const processEvent = calendarEvent => {
			const localCalendarEvent = calendarEvent;
			const eventMoment = moment(calendarEvent.EventStart);

			localCalendarEvent.eventMonth = eventMoment.format('MMM');
			localCalendarEvent.eventDate = eventMoment.format('D');
			localCalendarEvent.eventTime = formatTime(eventMoment.format('h:mm a'));
			localCalendarEvent.requiresRegistration = localCalendarEvent.RegistrationTypeCodeEnum !== 0;

			return localCalendarEvent;
		};

		const shouldDisplayRegistrationButton = eventData => {
			return !eventData.isStarted &&
				eventData.isRegistrationWindow &&
				eventData.requiresRegistration &&
				(!eventData.isFull || (eventData.isFull && eventData.isWaiting));
		};

		const formatFeaturedEvents = (events) => {
			const featuredEvents = [];

			events.forEach((event) => {
				const processedEvent = processEvent(event);
				featuredEvents.push(processedEvent);
			});

			return featuredEvents;
		};

		const getFeaturedEvents = (eventRequestModel) => {
			return $q((resolve, reject) => {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel)
					.then((response) => {
						if (response.data) {
							resolve(formatFeaturedEvents(response.data.Events));
						} else {
							reject(response);
						}
					}, reject);
			});
		};

		const setStartDateForOnGoingEvent = (signupEvent, currentDate) => {
			const cleanOnGoingStartDate = signupEvent.OnGoingStartDate.replace('T', ' ');
			const isEventStartingToday = moment(cleanOnGoingStartDate).isSame(currentDate, 'day');
			const localSignupEvent = signupEvent;

			if (isEventStartingToday) {
				localSignupEvent.EventStart = signupEvent.OnGoingStartDate;
			} else {
				localSignupEvent.EventStart = currentDate;
			}

			return localSignupEvent;
		};

		return {
			/* test-code */
			isEventOnDate,
			dateSplitter,
			formatTime,
			processEvent,
			setStartDateForOnGoingEvent,
			sortSplitEventsByEventStart,
			/* end-test-code */
			get,
			getById,
			getFeaturedEvents
		};
	};

	eventsService.$inject = ['events.CONSTANTS', '$http', '$q'];

	app.factory('dataServices.eventsService', eventsService);
})(window.moment);
