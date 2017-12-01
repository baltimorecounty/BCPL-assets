((app) => {
	'use strict';

	const EventDetailsCtrl = function EventsPageCtrl($scope, $timeout, $routeParams, CONSTANTS, eventsService, dateUtilityService) {
		const self = this;
		const id = $routeParams.id;

		self.data = {};
		self.data.EventStartDate = '';
		self.data.EventStartTime = '';
		self.data.EventEndTime = '';

		const processEventData = (data) => {
			self.data = data;
			self.data.EventStartDate = moment(self.data.EventStart).format('MMMM D, YYYY');
			self.data.EventSchedule = dateUtilityService.formatSchedule(self.data.EventStart, self.data.EventLength);
			self.isRegistrationRequired = self.data.RegistrationTypeCodeEnum !== 0;
			self.isOver = moment().isAfter(moment(self.data.EventStart).add(self.data.EventLength, 'm'));
		};

		eventsService.getById(id).then(processEventData);
	};

	EventDetailsCtrl.$inject = ['$scope', '$timeout', '$routeParams', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventDetailsCtrl', EventDetailsCtrl);
})(angular.module('eventsPageApp'));
