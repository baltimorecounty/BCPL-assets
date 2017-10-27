(() => {
	'use strict';

	const filterDirective = () => {
		const directive = {
			restrict: 'E',
			template: '<label><input type="checkbox" /> {{filter}}</label>'
		};

		return directive;
	};

	filterDirective.$inject = [];

	angular
		.module('filterPageApp')
		.directive('filter', filterDirective);
})();
