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

	const eventDateComparer = (a, b) => {
		return moment(a.EventStart).isAfter(moment(b.EventStart));
	};

	const buildEventsTemplate = (eventList) => {
		const eventsWithDateAndMonth = eventList.map(processEvent);

		const sourceHtml = $('#events-template').html();
		const template = Handlebars.compile(sourceHtml);
		const html = template(eventsWithDateAndMonth);

		$('#events-target').html(html);
	};

	const allEventsDataLoadedHandler = (allEventsResponse, featuredEvents) => {
		if (allEventsResponse.Events && allEventsResponse.Events.length) {
			const nonFeaturedEvents = allEventsResponse.Events
				.filter(eventData => eventData.FeatureEvent === false);

			const bufferedEvents = featuredEvents
				.concat(nonFeaturedEvents)
				.slice(0, 4)
				.sort(eventDateComparer);

			buildEventsTemplate(bufferedEvents);
		}
	};

	const featuredEventsDataLoadedHandler = featuredEventsResponse => {
		if (featuredEventsResponse.Events) {
			if (featuredEventsResponse.Events.length < 4) {
				const allEventsRequestModel = featuredEventsRequestModel;
				allEventsRequestModel.OnlyFeaturedEvents = false;

				$.post(CONSTANTS.baseApiUrl + CONSTANTS.homepage.urls.events, allEventsRequestModel)
					.done(allEventsResponse =>
						allEventsDataLoadedHandler(allEventsResponse, featuredEventsResponse.Events));
			} else {
				buildEventsTemplate(featuredEventsResponse.Events);
			}
		}
	};

	const featuredEventsEndDate = moment().add(90, 'days').format('M/D/YYYY');

	const featuredEventsRequestModel = {
		Limit: 4,
		Page: 1,
		OnlyFeaturedEvents: true,
		EndDate: featuredEventsEndDate
	};

	$.post(CONSTANTS.baseApiUrl + CONSTANTS.homepage.urls.events, featuredEventsRequestModel)
		.done(featuredEventsDataLoadedHandler);

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);

	return {
		/* test-code */
		processEvent,
		formatTime
		/* end-test-code */
	};
})(jQuery, Handlebars, moment, bcpl.constants);
