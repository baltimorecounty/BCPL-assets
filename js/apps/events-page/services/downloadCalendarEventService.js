((app, ICS) => {
	'use strict';

	const downloadCalendarEventService = ($window) => {
		const createEvent = (calendarParts) => {
			const {
				eventTitle, eventDescription, eventLocation, eventStartDate, eventEndDate
			} = calendarParts;

			let calEvent = new ICS();
			calEvent.addEvent(eventTitle, eventDescription, eventLocation, eventStartDate, eventEndDate);

			return calEvent;
		};

		const downloadCalendarEvent = (eventDetails) => {
			const calendarParts = getCalendarParts(eventDetails);
			const calendarEvent = createEvent(calendarParts);

			calendarEvent.download(calendarParts.eventTitle);
		};

		const getCalendarParts = (eventDetails) => {
			const {
				Description: eventDescription,
				LocationName,
				Title
			} = eventDetails;

			const eventTitle = `Baltimore County Public Library, ${LocationName} Branch - ${Title}`;
			const eventLocation = `${LocationName} Branch`;
			const eventDates = getEventDates(eventDetails);

			return {
				eventTitle,
				eventDescription,
				eventLocation,
				eventStartDate: eventDates.eventStartDate,
				eventEndDate: eventDates.eventEndDate
			};
		};

		const getEndDate = (startDateAsString, eventDetails) => {
			const {
				AllDay, EventSchedule, EventStart, OnGoingEndDate
			} = eventDetails;

			const endDateAsString = $window.moment(startDateAsString).format('MM/DD/YYYY');
			const eventEndTime = getEndTime(EventSchedule, AllDay);
			const endDateTimeAsString = !EventStart ? OnGoingEndDate : `${endDateAsString} ${eventEndTime}`;

			return $window.moment(endDateTimeAsString).format('MM/DD/YYYY h:mm:ss a');
		};

		const getEndTime = (eventSchedule, isAllDay) => {
			if (isAllDay) return '11:59:59 PM';

			const timeparts = eventSchedule.split('to');

			return timeparts.length === 2 ?
				timeparts[1].trim().replace(/\./g, '') :
				null;
		};

		const getStartDate = (eventDetails) => {
			const {
				EventStart, OnGoingStartDate
			} = eventDetails;
			const startDateAsString = EventStart || OnGoingStartDate;
			return $window.moment(startDateAsString).format('MM/DD/YYYY h:mm:ss a');
		};

		const getEventDates = (eventDetails) => {
			const eventStartDate = getStartDate(eventDetails);
			const eventEndDate = getEndDate(eventStartDate, eventDetails);

			return {
				eventStartDate,
				eventEndDate
			};
		};

		return {
			createEvent,
			downloadCalendarEvent,
			getCalendarParts,
			getEndDate,
			getEndTime,
			getStartDate,
			getEventDates
		};
	};

	downloadCalendarEventService.$inject = ['$window'];

	app.factory('downloadCalendarEventService', downloadCalendarEventService);
})(angular.module('eventsPageApp'), window.ics);
