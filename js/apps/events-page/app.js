(() => {
	'use strict';

	angular
		.module('eventsPageApp', 
			[
				'dataServices',
				'events',
				'ngAria',
				'ngRoute', 
				'ngSanitize'
			]);
})();
