((app) => {
	const eventsService = (CONSTANTS, $http, $q) => {
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
						date: new Date(eventItem.EventStart),
						events: eventData.filter((thisEvent) => isEventOnDate(thisEvent, eventDate))
					});

					lastEventDate = eventDate;
				}
			});

			return eventsByDate;
		};

		const get = (eventRequestModel) => {
			const localeEventRequestModel = eventRequestModel;

			localeEventRequestModel.StartDate = localeEventRequestModel.StartDate.toLocaleDateString();
			localeEventRequestModel.EndDate = localeEventRequestModel.EndDate.toLocaleDateString();

			return $q((resolve, reject) => {
				$http.post(CONSTANTS.baseUrl + CONSTANTS.serviceUrls.events, localeEventRequestModel)
					.then((response) => {
						resolve(dateSplitter(response.data));
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
