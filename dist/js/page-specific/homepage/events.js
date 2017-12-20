'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.events = function ($, Handlebars, moment, CONSTANTS) {
	var activatePost = function activatePost(event) {
		var $target = $(event.currentTarget);
		var $animationTarget = $target.find('.animated');

		$animationTarget.addClass('active');
	};

	var deactivatePost = function deactivatePost(event) {
		var $target = $(event.currentTarget);
		var $animationTarget = $target.find('.animated');

		$animationTarget.removeClass('active');
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

	var eventsDataLoadedHandler = function eventsDataLoadedHandler(eventsResponse) {
		if (eventsResponse.Events.length) {
			var eventsWithDateAndMonth = eventsResponse.Events.map(processEvent);

			var sourceHtml = $('#events-template').html();
			var template = Handlebars.compile(sourceHtml);
			var html = template(eventsWithDateAndMonth);

			$('#events-target').html(html);
		}
	};

	$.ajax(CONSTANTS.homepage.urls.events).done(eventsDataLoadedHandler);

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);

	return {
		/* test-code */
		processEvent: processEvent,
		formatTime: formatTime
		/* end-test-code */
	};
}(jQuery, Handlebars, moment, bcpl.constants);