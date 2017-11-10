((app) => {
	const eventsService = (CONSTANTS, $http, querystringService) => {
		const isEventOnDate = (eventItem, eventDate) => {
			const eventItemDate = (new Date(eventItem.EventStart)).toLocaleDateString();
			return eventItemDate === eventDate;
		};

		const dateSplitter = (eventData) => {
			let eventsByDate = [];
			let lastEventDate;

			angular.forEach(eventData, (eventItem) => {
				let eventDate = (new Date(eventItem.EventStart)).toLocaleDateString();

				if (lastEventDate !== eventDate) {
					eventsByDate.push({
						date: eventDate,
						events: eventData.filter((thisEvent) => isEventOnDate(thisEvent, eventDate))
					});

					lastEventDate = eventDate;
				}
			});

			return eventsByDate;
		};

		const get = (eventRequestModel, successCallback, errorCallback) => {
			$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, eventRequestModel)
				.then((response) => {
					successCallback(dateSplitter(response.data));
				}, errorCallback);
		};

		return {
			/* test-code */
			isEventOnDate,
			dateSplitter,
			/* end-test-code */
			get
		};
	};

	eventsService.$inject = ['CONSTANTS', '$http', 'querystringService'];

	app.factory('eventsService', eventsService);
})(angular.module('eventsPageApp'));
