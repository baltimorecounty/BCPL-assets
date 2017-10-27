(() => {
	'use strict';

	const cardDirective = ($compile, templateService) => {
		const cardLink = ($scope, element, attrs) => {
			element.append($compile(templateService.get(attrs.template))($scope));
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

	cardDirective.$inject = ['$compile', 'templateService'];

	angular
		.module('filterPageApp')
		.directive('card', cardDirective);
})();
