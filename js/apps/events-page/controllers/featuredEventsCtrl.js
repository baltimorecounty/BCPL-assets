((app) => {
	'use strict';

	const FeaturedEventsCtrl = function FeaturedEventsCtrl(eventsService) {
		const vm = this;

		const handleError = (error) => console.error(error); // eslint-disable-line no-console

		const processEventData = (featuredEventList) => {
			console.log(featuredEventList);
			vm.featuredEventList = featuredEventList;
		};

		var requestPayload = {
			Limit: 4,
			Locations: [1, 2],
			EventTypes: [10]
		};

		eventsService.get(requestPayload)
			.then(processEventData)
			.catch(handleError);
	};

	FeaturedEventsCtrl.$inject = ['eventsService'];

	app.controller('FeaturedEventsCtrl', FeaturedEventsCtrl);
})(angular.module('eventsPageApp'));
