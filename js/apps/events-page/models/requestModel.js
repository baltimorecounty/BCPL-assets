((app) => {
	'use strict';

	const requestModel = ($window, CONSTANTS) => {
		return (model) => {
			const startDateLocaleString = $window.moment().format();
			const endDateLocaleString = $window.moment().add(30, 'd').format();

			return {
				StartDate: model.StartDate || startDateLocaleString,
				EndDate: model.EndDate || endDateLocaleString,
				Page: model.Page || 1,
				IsOngoingVisible: model.IsOngoingVisible || true,
				IsSpacesReservationVisible: model.IsSpacesReservationVisible || false,
				Limit: model.limit || CONSTANTS.requestChunkSize,
				EventsTypes: model.EventTypes || [],
				AgeGroups: model.AgeGroups || [],
				Locations: model.locations || [],
				Keyword: model.Keyword || ''
			};
		};
	};

	requestModel.$inject(['$window', 'CONSTANTS']);

	app.factory('RequestModel', requestModel);
})(angular.module('eventsPageApp'));
