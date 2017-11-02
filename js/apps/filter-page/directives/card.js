((app) => {
	'use strict';

	const cardDirective = ($compile, $injector, $animate) => {
		const cardLink = ($scope, element, attrs) => {
			element.append($compile($injector.get(attrs.template + 'Service').template)($scope));

			/* $scope.$watch('cardData', () => {

			});

			$animate.enter(element, element.parentElement, () => {
				console.log(1);
			});

			$animate.enter(element, element.parentElement, () => {
				console.log(1);
			}); */
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

	cardDirective.$inject = ['$compile', '$injector', '$animate'];

	app.directive('card', cardDirective);
})(angular.module('filterPageApp'));
