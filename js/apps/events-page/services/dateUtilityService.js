((app) => {
  "use strict";

  const dateUtilityService = () => {
    const addDays = (dateOrString, daysToAdd) => {
      const date =
        typeof dateOrString === "string"
          ? new Date(dateOrString)
          : dateOrString;

      if (typeof date !== "object") return date;

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
    const formatSchedule = (eventItem, eventLength, isAllDay) => {
      const eventStart = eventItem.EventStart || null;
      const onGoingStartDate = eventItem.OnGoingStartDate;
      const onGoingEndDate = eventItem.OnGoingEndDate;

      if (isAllDay) return "All Day";

      if (
        (!eventStart && !onGoingStartDate && !onGoingEndDate) ||
        (eventStart && isNaN(Date.parse(eventStart)))
      ) {
        return "Bad start date format";
      }

      if (eventStart && (typeof eventLength !== "number" || eventLength < 0)) {
        return "Bad event length format";
      }

      if (onGoingStartDate && onGoingEndDate) {
        const dateFormat = "M/D";
        return `${moment(onGoingStartDate).format(dateFormat)} to ${moment(
          onGoingEndDate
        ).format(dateFormat)}`;
      }

      const eventStartDate = moment(eventStart);
      const eventEndDate = moment(eventStart).add(eventLength, "m");
      const startHour = get12HourValue(eventStartDate);
      const startMinutes = eventStartDate
        .minute()
        .toLocaleString(undefined, { minimumIntegerDigits: 2 });
      const startAmPm = getAmPm(eventStartDate);
      const endHour = get12HourValue(eventEndDate);
      const endMinutes = eventEndDate
        .minute()
        .toLocaleString(undefined, { minimumIntegerDigits: 2 });
      const endAmPm = getAmPm(eventEndDate);

      return `${startHour}${
        parseInt(startMinutes) === 0 ? "" : ":" + startMinutes
      } ${startAmPm === endAmPm ? "" : startAmPm} to ${endHour}${
        parseInt(endMinutes) === 0 ? "" : ":" + endMinutes
      } ${endAmPm}`;
    };

    const get12HourValue = (date) => {
      const rawHours = date.hour();

      if (rawHours === 0) return 12;

      if (rawHours <= 12) return rawHours;

      return rawHours - 12;
    };

    const getAmPm = (date) => {
      return date.hour() < 12 ? "a.m." : "p.m.";
    };

    return {
      /* test-code */
      get12HourValue,
      getAmPm,
      /* end-test-code */
      addDays,
      formatSchedule,
    };
  };

  app.factory("dateUtilityService", dateUtilityService);
})(angular.module("eventsPageApp"));
