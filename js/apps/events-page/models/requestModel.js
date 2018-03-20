((app) => {
	'use strict';

	const RequestModel = ($window, CONSTANTS) => {
		return (requestModel) => {
			const model = requestModel || {};

			const startDateLocaleString = $window.moment().format();
			const endDateLocaleString = $window.moment().add(30, 'd').format();
			const eventTypes = model.eventTypes || [];

			return {
				StartDate: model.StartDate || startDateLocaleString,
				EndDate: model.EndDate || endDateLocaleString,
				Page: model.Page || 1,
				IsOngoingVisible: model.IsOngoingVisible || true,
				IsSpacesReservationVisible: model.IsSpacesReservationVisible || false,
				Limit: model.limit || CONSTANTS.requestChunkSize,
				EventsTypes: eventTypes, // HACK: API Needs this
				AgeGroups: model.AgeGroups || [],
				Locations: model.locations || [],
				Keyword: model.Keyword || ''
			};
		};
	};

	RequestModel.$inject = ['$window', 'events.CONSTANTS'];

	app.factory('RequestModel', RequestModel);
})(angular.module('eventsPageApp'));
