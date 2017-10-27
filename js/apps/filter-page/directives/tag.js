(() => {
	'use strict';

	const tagDirective = () => {
		const directive = {
			restrict: 'E',
			template: '<button>{{tag}}</label>'
		};

		return directive;
	};

	tagDirective.$inject = [];

	angular
		.module('filterPageApp')
		.directive('tag', tagDirective);
})();
