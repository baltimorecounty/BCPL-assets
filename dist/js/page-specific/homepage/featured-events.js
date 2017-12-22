'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.featuredEvents = function ($, Handlebars, moment, CONSTANTS) {
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

	var eventDateComparer = function eventDateComparer(a, b) {
		return moment(a.EventStart).isAfter(moment(b.EventStart));
	};

	var buildEventsTemplate = function buildEventsTemplate(eventList) {
		var eventsWithDateAndMonth = eventList.map(processEvent);

		var sourceHtml = $('#events-template').html();
		var template = Handlebars.compile(sourceHtml);
		var html = template(eventsWithDateAndMonth);

		$('#events-target').html(html);
	};

	var allEventsDataLoadedHandler = function allEventsDataLoadedHandler(allEventsResponse, featuredEvents) {
		if (allEventsResponse.Events && allEventsResponse.Events.length) {
			var nonFeaturedEvents = allEventsResponse.Events.filter(function (eventData) {
				return eventData.FeatureEvent === false;
			});

			var bufferedEvents = featuredEvents.concat(nonFeaturedEvents).slice(0, 4).sort(eventDateComparer);

			buildEventsTemplate(bufferedEvents);
		}
	};

	var featuredEventsDataLoadedHandler = function featuredEventsDataLoadedHandler(featuredEventsResponse) {
		if (featuredEventsResponse.Events) {
			if (featuredEventsResponse.Events.length < 4) {
				var allEventsRequestModel = featuredEventsRequestModel;
				allEventsRequestModel.OnlyFeaturedEvents = false;

				$.post(CONSTANTS.homepage.urls.events, allEventsRequestModel).done(function (allEventsResponse) {
					return allEventsDataLoadedHandler(allEventsResponse, featuredEventsResponse.Events);
				});
			} else {
				buildEventsTemplate(featuredEventsResponse.Events);
			}
		}
	};

	var featuredEventsEndDate = moment().add(90, 'days').format('M/D/YYYY');

	var featuredEventsRequestModel = {
		Limit: 4,
		Page: 1,
		OnlyFeaturedEvents: true,
		EndDate: featuredEventsEndDate
	};

	$.post(CONSTANTS.homepage.urls.events, featuredEventsRequestModel).done(featuredEventsDataLoadedHandler);

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);

	return {
		/* test-code */
		processEvent: processEvent,
		formatTime: formatTime
		/* end-test-code */
	};
}(jQuery, Handlebars, moment, bcpl.constants);