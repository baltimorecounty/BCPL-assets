((app) => {
	'use strict';

	const filtersDirective = (metaService, CONSTANTS) => {
		const filtersLink = (scope) => {
			const innerScope = scope;

			const filterSuccess = (data) => {
				innerScope.items = data;
			};

			innerScope.search = (searchItem, termType, isChecked) => {
				const identifier = searchItem.item.Id || searchItem.item.LocationId;
				innerScope.searchFunction(identifier, termType, isChecked);
			};

			innerScope.removeDisallowedCharacters = (str) => {
				const disallowedCharactersRegex = /[^A-Za-z0-9-_.]/g;

				return str.trim().replace(disallowedCharactersRegex, '-');
			};

			innerScope.items = [];

			if (CONSTANTS.remoteServiceUrls[innerScope.filterType]) {
				metaService.request(CONSTANTS.remoteServiceUrls[innerScope.filterType]).then(filterSuccess);
			}
		};

		const directive = {
			link: filtersLink,
			restrict: 'E',
			scope: {
				filterType: '@',
				choiceType: '@',
				searchFunction: '='
			},
			templateUrl: CONSTANTS.templateUrls.filtersExpandosTemplate
		};

		return directive;
	};

	filtersDirective.$inject = ['metaService', 'events.CONSTANTS'];

	app.directive('filtersExpandos', filtersDirective);
})(angular.module('eventsPageApp'));
