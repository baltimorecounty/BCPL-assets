((app) => {
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
			const localeEventRequestModel = eventRequestModel;

			return $q((resolve, reject) => {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, localeEventRequestModel)
					.then((response) => {
						if (response.data) {
							resolve(dateSplitter(response.data.Events));
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
			get
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', '$q'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
