((app) => {
	'use strict';

	const emailUtilityService = () => {
		const getEmailBody = (destinationUrl) => `Check out this event at the Baltimore County Public Library: ${destinationUrl}`;
		const getEmailSubject = (data) => `${data.EventStartDate} - ${data.Title}`;
		const getShareUrl = (data, url) => {
			const emailBody = getEmailBody(url);
			const emailSubject = getEmailSubject(data);

			return `mailto:?subject=${emailSubject}&body=${emailBody}`;
		};

		return {
			getEmailBody,
			getEmailSubject,
			getShareUrl
		};
	};

	app.factory('emailUtilityService', emailUtilityService);
})(angular.module('eventsPageApp'));
