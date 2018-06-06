((app) => {
	'use strict';

	const featuredEventsLink = (scope, eventsService, $window) => {
		const branches = scope.branches && scope.branches.length ? scope.branches : [];
		const eventTypes = scope.eventTypes && scope.eventTypes.length ? scope.eventTypes : [];
		const resultsToDisplay = scope.resultsToDisplay || 3;
		const shouldPrioritzeFeatured = !!scope.prioritizeFeatured;

		const startDateLocaleString = $window.moment().format();
		const endDateLocaleString = $window.moment().add(60, 'd').format();

		const buildRequestPayLoad = (limit, locations, events, prioritizeFeatured) => {
			let payLoad = {
				Limit: limit,
				OnlyFeaturedEvents: prioritizeFeatured,
				StartDate: startDateLocaleString,
				EndDate: endDateLocaleString
			};

			if (branches.length) {
				payLoad.Locations = locations;
			}

			if (eventTypes.length) {
				payLoad.EventsTypes = events;
			}

			return payLoad;
		};
		const handleError = (error) => console.error(error);

		const eventRequestPayload = buildRequestPayLoad(resultsToDisplay, branches, eventTypes, shouldPrioritzeFeatured);

		eventsService.getFeaturedEvents(eventRequestPayload)
			.then(featuredEventList => {
				scope.featuredEventList = featuredEventList; // eslint-disable-line
				if (featuredEventList.length === 0) {
					scope.resultsToDisplay = 0; // eslint-disable-line
				}
			})
			.catch(handleError);// eslint-disable-line no-console
	};


	const featuredEventsDirective = (CONSTANTS, eventsService, $window) => {
		const directive = {
			restrict: 'E',
			scope: {
				branches: '=',
				resultsToDisplay: '=',
				eventTypes: '=',
				prioritizeFeatured: '='
			},
			templateUrl: CONSTANTS.templateUrls.featuredEventsTemplate,
			link: (scope) => featuredEventsLink(scope, eventsService, $window)
		};

		return directive;
	};

	featuredEventsDirective.$inject = ['events.CONSTANTS', 'dataServices.eventsService', '$window'];

	app.directive('featuredEvents', featuredEventsDirective);
})(angular.module('featuredEventsWidgetApp'));
