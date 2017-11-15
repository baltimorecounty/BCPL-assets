((app) => {
	const dateUtilityService = () => {
		const addDays = (dateOrString, daysToAdd) => {
			const date = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;

			if (typeof date !== 'object' || date === 'Invalid Date') {
				return date;
			}

			date.setDate(date.getDate() + daysToAdd);

			return date;
		};

		const formatSchedule = (eventStart, eventLength) => {
			if (!eventStart || isNaN(Date.parse(eventStart))) {
				return 'Bad start date format';
			}

			if (typeof eventLength !== 'number' || eventLength <= 0) {
				return 'Bad event length format';
			}

			const eventStartDate = new Date(eventStart);
			const eventEndDate = new Date(eventStart);
			const eventEndDateMinutes = eventStartDate.getMinutes() + eventLength;
			eventEndDate.setMinutes(eventEndDateMinutes);

			const startHour = get12HourValue(eventStartDate);
			const startMinutes = getMinuteString(eventStartDate.getMinutes());
			const startAmPm = getAmPm(eventStartDate);
			const endHour = get12HourValue(eventEndDate);
			const endMinutes = getMinuteString(eventEndDate.getMinutes());
			const endAmPm = getAmPm(eventEndDate);

			return `${startHour}:${startMinutes} ${startAmPm} to ${endHour}:${endMinutes} ${endAmPm}`;
		};

		const get12HourValue = (date) => {
			const rawHours = date.getHours();

			if (rawHours === 0) return 12;

			if (rawHours <= 12) return rawHours;

			return rawHours - 12;
		};

		const getAmPm = (date) => {
			return date.getHours() < 12 ? 'a.m.' : 'p.m.';
		};

		const getMinuteString = (minutes) => {
			return minutes < 10 ? '0' + minutes : '' + minutes;
		};

		return {
			/* test-code */
			get12HourValue,
			getAmPm,
			getMinuteString,
			/* end-test-code */
			addDays,
			formatSchedule
		};
	};

	app.factory('dateUtilityService', dateUtilityService);
})(angular.module('eventsPageApp'));
