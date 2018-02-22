(() => {
	'use strict';

	angular
		.module('eventsPageApp', 
			[
				'dataServices',
				'events',
				'sharedConstants',
				'sharedServices',
				'sharedFilters',
				'ngAria',
				'ngRoute', 
				'ngSanitize'
			]);
})();
