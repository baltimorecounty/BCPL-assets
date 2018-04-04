((app) => {
	'use strict';

	const cardDirective = ($compile, $injector, $templateRequest, CONSTANTS) => {
		const cardLink = ($scope, element, attrs) => {
			$templateRequest(CONSTANTS.templates[attrs.template]).then((html) => {
				element.append($compile(html)($scope));
			});
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
})(angular.module('filterPageApp'));
