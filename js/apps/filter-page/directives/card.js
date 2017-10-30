(() => {
	'use strict';

	const cardDirective = ($compile, $injector) => {
		const cardLink = ($scope, element, attrs) => {
			element.append($compile($injector.get(attrs.template + 'Service').template)($scope));
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

	cardDirective.$inject = ['$compile', '$injector'];

	angular
		.module('filterPageApp')
		.directive('card', cardDirective);
})();
