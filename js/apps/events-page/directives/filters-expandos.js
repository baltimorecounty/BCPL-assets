((app, googleAnalytics) => {
	'use strict';

	const { trackEvent } = googleAnalytics;

	const filtersDirective = (metaService, CONSTANTS) => {
		const filtersLink = (scope) => {
			const innerScope = scope;

			innerScope.search = (searchItem, termType, isChecked) => {
				const identifier = searchItem.item.Id || searchItem.item.LocationId;
				const name = searchItem.item.Name || searchItem.item.Id;
				innerScope.searchFunction(identifier, termType, isChecked, name, innerScope.items);

				trackEvent({
					action: `${termType} Filter Selection`,
					category: 'Events',
					label: `${name} - ${isChecked ? 'Selected' : 'Unselected'}`
				});
			};

			innerScope.removeDisallowedCharacters = (str) => {
				const disallowedCharactersRegex = /[^A-Za-z0-9-_.]/g;

				return str.trim().replace(disallowedCharactersRegex, '-');
			};

			innerScope.isFilterChecked = (filterType, item) => {
				const targetId = filterType && filterType === 'locations' ?
					item.LocationId :
					item.Id;

				return innerScope.activeFilters ?
					innerScope.activeFilters.includes(targetId) :
					false;
			};
		};

		const directive = {
			link: filtersLink,
			restrict: 'E',
			scope: {
				filterType: '@',
				choiceType: '@',
				searchFunction: '=',
				items: '=',
				activeFilters: '='
			},
			templateUrl: CONSTANTS.templateUrls.filtersExpandosTemplate
		};

		return directive;
	};

	filtersDirective.$inject = ['metaService', 'events.CONSTANTS'];

	app.directive('filtersExpandos', filtersDirective);
})(angular.module('eventsPageApp'), bcpl.utility.googleAnalytics);
