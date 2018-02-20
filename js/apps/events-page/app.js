(() => {
	'use strict';

	angular
		.module('eventsPageApp', 
			[
				'dataServices',
				'events',
				'sharedConstants',
				'sharedServices',
				'ngAria',
				'ngRoute', 
				'ngSanitize'
			]);
})();
