((app) => {
	'use strict';

	const EventsPageCtrl = function EventsPageCtrl($scope, $timeout, CONSTANTS, eventsService) {
		const self = this;
		const firstPage = 1;
		const startDateLocaleString = (new Date()).toLocaleString();
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);
		const endDateLocaleString = endDate.toLocaleString();
		const requestModel = {
			StartDate: startDateLocaleString,
			EndDate: endDateLocaleString,
			Page: firstPage,
			IsOngoingVisible: true,
			Limit: CONSTANTS.requestChunkSize
		};

		/* ** Public ** */

		self.eventGroups = [];
		self.keywords = '';
		self.chunkSize = CONSTANTS.requestChunkSize;

		self.keywordSearch = () => {
			requestModel.Keyword = self.keywords;
			requestModel.StartDate = startDateLocaleString;
			self.eventGroups = [];

			eventsService.get(requestModel)
				.then((eventGroups) => {
					self.eventGroups = eventGroups;
				});
		};

		self.filterByDate = () => {
			switch (self.dateFilterType) {
			case 'today':
				requestModel.StartDate = moment().format();
				requestModel.EndDate = moment().hour(23).minute(59).second(59).format();
				break;
			case 'tomorrow':
				requestModel.StartDate = moment.utc().add(1, 'days').hour(0).minute(0).second(0).format();
				requestModel.EndDate = moment.utc().add(1, 'days').hour(23).minute(59).second(59).format();
				break;
			case 'next7':
				requestModel.StartDate = moment().format();
				requestModel.EndDate = moment().add(6, 'days').hour(23).minute(59).second(59).format();
				break;
			case 'custom':
				requestModel.StartDate = self.userStartDate;
				requestModel.endDate = self.userEndDate;
				break;
			default:
				break;
			}

			if (requestModel.StartDate && requestModel.EndDate) {
				self.eventGroups = [];

				eventsService.get(requestModel)
					.then((eventGroups) => {
						self.eventGroups = eventGroups;
					});
			}
		};

		self.loadNextPage = () => {
			requestModel.Page += 1;

			eventsService.get(requestModel)
				.then((eventGroups) => {
					const results = combineEventGroups(self.eventGroups, eventGroups);
					self.eventGroups = results;
				});
		};

		/* ** Private ** */

		const isSameDay = (day1Date, day2Date) => {
			if (day1Date.toLocaleDateString && day2Date.toLocaleDateString) {
				return day1Date.toLocaleDateString() === day2Date.toLocaleDateString();
			}

			return false;
		};

		const combineEventGroups = (oldEventGroups, newEventGroups) => {
			let renderedEventGroups = oldEventGroups;
			let lastEventGroup = renderedEventGroups[renderedEventGroups.length - 1];

			angular.forEach(newEventGroups, (eventGroup) => {
				if (isSameDay(lastEventGroup.date, eventGroup.date)) {
					lastEventGroup.events = lastEventGroup.events.concat(eventGroup.events);
				} else {
					renderedEventGroups.push(eventGroup);
				}
			});

			return renderedEventGroups;
		};

		/* ** Init ** */

		eventsService.get(requestModel)
			.then((eventGroups) => {
				self.eventGroups = eventGroups;
			});
	};

	EventsPageCtrl.$inject = ['$scope', '$timeout', 'CONSTANTS', 'eventsService', 'dateUtilityService'];

	app.controller('EventsPageCtrl', EventsPageCtrl);
})(angular.module('eventsPageApp'));
