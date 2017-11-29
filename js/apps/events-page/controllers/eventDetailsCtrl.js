((app) => {
	'use strict';

	const EventDetailsCtrl = function EventsPageCtrl($scope, $timeout, $routeParams, CONSTANTS, eventsService) {
		const self = this;
		const id = $routeParams.id;

		self.data = {};
		self.data.EventStartDate = '';
		self.data.EventStartTime = '';
		self.data.EventEndTime = '';

		const processEventData = (data) => {
			self.data = data;
			self.data.EventStartDate = moment(self.data.EventStart).format('MMMM Do, YYYY');
			self.data.EventStartTime = moment(self.data.EventStart).format('h:mm a');
			self.data.EventEndTime = moment(self.data.EventStart).add(self.data.EventLength, 'm').format('h:mm a');

			

			console.log(self.data);
		};

		eventsService.getById(id).then(processEventData);
	};

	EventDetailsCtrl.$inject = ['$scope', '$timeout', '$routeParams', 'CONSTANTS', 'eventsService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'));
