namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.featuredEvents = (($, Handlebars, moment, CONSTANTS) => {
	const activatePost = (event) => {
		const $target = $(event.currentTarget);
		const $animationTarget = $target.find('.animated');

		$animationTarget.addClass('active');
	};

	const deactivatePost = (event) => {
		const $target = $(event.currentTarget);
		const $animationTarget = $target.find('.animated');

		$animationTarget.removeClass('active');
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

	const eventsDataLoadedHandler = eventsResponse => {
		if (eventsResponse.Events.length) {
			const eventsWithDateAndMonth = eventsResponse.Events.map(processEvent);

			const sourceHtml = $('#events-template').html();
			const template = Handlebars.compile(sourceHtml);
			const html = template(eventsWithDateAndMonth);

			$('#events-target').html(html);
		}
	};

	$.ajax(CONSTANTS.homepage.urls.events)
		.done(eventsDataLoadedHandler);

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);

	return {
		/* test-code */
		processEvent,
		formatTime
		/* end-test-code */
	};
})(jQuery, Handlebars, moment, bcpl.constants);
