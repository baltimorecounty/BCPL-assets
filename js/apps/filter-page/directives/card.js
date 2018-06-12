((app, googleAnalytics) => {
	'use strict';

	const { trackEvent } = googleAnalytics;

	const cardDirective = ($compile, $injector, $templateRequest, CONSTANTS) => {
		const cardLink = ($scope, element, attrs) => {
			$templateRequest(CONSTANTS.templates[attrs.template]).then((html) => {
				element.append($compile(html)($scope));
			});

			const continueToTargetLocation = (target) => {
				if (target && target.href) {
					window.location = target.href;
				}
			};

			$scope.track = (action, label, trackingEvent) => {
				trackingEvent.preventDefault();

				trackEvent({
					action,
					category: CONSTANTS.analytics.bcplLocationsCategory,
					label
				});

				continueToTargetLocation(trackingEvent.currentTarget)
			};

		};



		const directive = {
			restrict: 'E',
			scope: {
				filterHandler: '=',
				cardData: '=',
				activeFilters: '=',
				template: '='
			},
			template: '',
			link: cardLink
		};

		return directive;
	};

	cardDirective.$inject = ['$compile', '$injector', '$templateRequest', 'CONSTANTS'];

	app.directive('card', cardDirective);
})(angular.module('filterPageApp'), bcpl.utility.googleAnalytics);
