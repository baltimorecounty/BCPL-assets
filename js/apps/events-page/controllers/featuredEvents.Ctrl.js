((app) => {
	'use strict';

	const FeaturedEventsCtrl = function FeaturedEventsCtrl(eventsService) {
		const vm = this;

		const handleError = (error) => console.error(error); // eslint-disable-line no-console

		const processEventData = (featuredEventList) => {
			vm.featuredEventList = eventList;
		};

		eventsService.get()
			.then(processEventData)
			.catch(handleError);
	};

	FeaturedEventsCtrl.$inject = ['eventsService'];

	app.controller('FeaturedEventsCtrl', FeaturedEventsCtrl);
})(angular.module('eventsPageApp'));
