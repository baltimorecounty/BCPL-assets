((app, moment) => {
	'use strict';

	const eventsService = (CONSTANTS, $http, $q) => {
		const isEventOnDate = (eventItem, eventDate) => {
			const eventItemStartDateLocaleString = (new Date(eventItem.EventStart)).toLocaleDateString();

			return eventItemStartDateLocaleString === eventDate;
		};

		const dateSplitter = (eventData) => {
			let eventsByDate = [];
			let lastEventDateLocaleString;

			angular.forEach(eventData, (eventItem) => {
				let eventStartDateLocaleString = (new Date(eventItem.EventStart)).toLocaleDateString();

				if (lastEventDateLocaleString !== eventStartDateLocaleString) {
					eventsByDate.push({
						date: new Date(eventItem.EventStart),
						events: eventData.filter((thisEvent) =>
							isEventOnDate(thisEvent, eventStartDateLocaleString))
					});

					lastEventDateLocaleString = eventStartDateLocaleString;
				}
			});

			return eventsByDate;
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

		return {
			/* test-code */
			isEventOnDate,
			dateSplitter,
			formatTime,
			processEvent,
			/* end-test-code */
			get,
			getById,
			getFeaturedEvents
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'), window.moment);
