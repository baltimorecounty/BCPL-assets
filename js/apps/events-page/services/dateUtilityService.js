((app) => {
	'use strict';

	const dateUtilityService = () => {
		const addDays = (dateOrString, daysToAdd) => {
			const date = typeof dateOrString === 'string' ?
				new Date(dateOrString) :
				dateOrString;

			if (typeof date !== 'object') return date;

			date.setDate(date.getDate() + daysToAdd);

			return date;
		};

		const formatSchedule = (eventStart, eventLength, isAllDay) => {
			if (isAllDay) return 'All Day';

			if (!eventStart || isNaN(Date.parse(eventStart))) {
				return 'Bad start date format';
			}

			if (typeof eventLength !== 'number' || eventLength <= 0) {
				return 'Bad event length format';
			}

			const eventStartDate = moment(eventStart);
			const eventEndDate = moment(eventStart).add(eventLength, 'm');
			const startHour = get12HourValue(eventStartDate);
			const startMinutes = eventStartDate.minute();
			const startAmPm = getAmPm(eventStartDate);
			const endHour = get12HourValue(eventEndDate);
			const endMinutes = eventEndDate.minute();
			const endAmPm = getAmPm(eventEndDate);

			return `${startHour}${startMinutes === 0 ? '' : ':' + startMinutes} ${startAmPm === endAmPm ? '' : startAmPm} to ${endHour}${endMinutes === 0 ? '' : ':' + endMinutes} ${endAmPm}`;
		};

		const get12HourValue = (date) => {
			const rawHours = date.hour();

			if (rawHours === 0) return 12;

			if (rawHours <= 12) return rawHours;

			return rawHours - 12;
		};

		const getAmPm = (date) => {
			return date.hour() < 12 ? 'a.m.' : 'p.m.';
		};

		return {
			/* test-code */
			get12HourValue,
			getAmPm,
			/* end-test-code */
			addDays,
			formatSchedule
		};
	};

	app.factory('dateUtilityService', dateUtilityService);
})(angular.module('eventsPageApp'));
