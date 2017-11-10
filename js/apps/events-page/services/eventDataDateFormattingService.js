((app) => {
	const eventDataDateFormattingService = () => {
		const formatSchedule = (eventStart, eventLength) => {
			if (!eventStart || Number.isNaN(Date.parse(eventStart))) {
				return 'Bad start date format';
			}

			if (typeof eventLength !== 'number' || eventLength <= 0) {
				return 'Bad event length format';
			}

			const eventStartDate = new Date(eventStart);
			const eventEndDate = new Date(eventStart);
			eventEndDate.setMinutes(eventStartDate.getMinutes() + eventLength);

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
			formatSchedule
		};
	};

	app.factory('eventDataDateFormattingService', eventDataDateFormattingService);
})(angular.module('eventsPageApp'));
