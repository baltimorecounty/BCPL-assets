((app) => {
	'use strict';

	const eventsService = (CONSTANTS, $http, $q) => {
		const isEventOnDate = (eventItem, eventDate) => {
			const eventItemStartDateLocaleString = (new Date(eventItem.EventStart)).toLocaleDateString();
			return eventItemStartDateLocaleString === eventDate;
		};

		const dateSplitter = (eventData) => {
			let eventsByDate = [];
			let lastEventDateLocaleString;

			angular.forEach(eventData, (eventItem) => {
				let eventStartDateLocaleString = (new Date(eventItem.EventStart)).toLocaleDateString();

				if (lastEventDateLocaleString !== eventStartDateLocaleString) {
					eventsByDate.push({
						date: new Date(eventItem.EventStart),
						events: eventData.filter((thisEvent) =>
							isEventOnDate(thisEvent, eventStartDateLocaleString))
					});

					lastEventDateLocaleString = eventStartDateLocaleString;
				}
			});

			return eventsByDate;
		};

		const get = (eventRequestModel) => {
			return $q((resolve, reject) => {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel)
					.then((response) => {
						if (response.data) {
							resolve({
								eventGroups: dateSplitter(response.data.Events),
								totalResults: response.data.TotalResults
							});
						} else {
							reject(response);
						}
					}, reject);
			});
		};

		const getById = (id) => {
			return $q((resolve, reject) => {
				$http.get(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events + '/' + id)
					.then((response) => {
						if (response.data) {
							resolve(response.data);
						} else {
							reject(response);
						}
					}, reject);
			});
		};

		return {
			/* test-code */
			isEventOnDate,
			dateSplitter,
			/* end-test-code */
			get,
			getById
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
