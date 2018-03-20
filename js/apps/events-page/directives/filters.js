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

			innerScope.isFilterChecked = (filterType, item) => {
				const targetId = filterType && filterType === 'locations' ?
					item.LocationId :
					item.Id;

				return innerScope.activeFilters.includes(targetId);
			};
		};

		const directive = {
			link: filtersLink,
			restrict: 'E',
			scope: {
				filterType: '@',
				choiceType: '@',
				searchFunction: '=',
				activeFilters: '='
			},
			templateUrl: CONSTANTS.templateUrls.filtersTemplate
		};

		return directive;
	};

	filtersDirective.$inject = ['metaService', 'events.CONSTANTS'];

	app.directive('filters', filtersDirective);
})(angular.module('eventsPageApp'));
