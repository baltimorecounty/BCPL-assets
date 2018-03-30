(() => {
	'use strict';

	angular
		.module('filterPageApp', ['ngAnimate', 'ngAria'])
		.config(function config($locationProvider) {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});
		});
})();
