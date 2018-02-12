(() => {
	'use strict';

	angular
		.module('eventsPageApp', 
			[
				'dataServices',
				'events',
				'ngRoute', 
				'ngSanitize'
			]);
})();
