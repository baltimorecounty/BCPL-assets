(() => {
	'use strict';

	const app = angular.module('sharedFilters', []);

	const filterHelpers = ($location) => {
		const clearQueryParams = (key) => {
			$location.search({});
		};

		const doesKeyExist = (queryParams, key) => {
			if (!key) return false;

			const matches = Object.keys(queryParams)
				.filter((paramKey) => paramKey.toLowerCase() === key.toLowerCase());

			return !!matches.length;
		};

		//TODO: FILTERS MUST BE A STRING???
		const getFiltersFromString = (filterStr) => {
			if(!filterStr) return [];

			return filterStr && filterStr.indexOf(',') > -1 ?  
				filterStr.split(',') : 
				[ filterStr ];
		};

		const getQueryParams = () => $location.search();

		const getQueryParamValuesByKey = (queryParams, key) => {
			return Object.hasOwnProperty.call(queryParams, key) ?
				getFiltersFromString(queryParams[key]) :
				[];
		};

		const setQueryParams = (key, val) => {
			if (!key) return;

			const queryParam = $location.search();
			queryParam[key] = val;

			$location.search(queryParam);
		};

		const updateQueryParams = (key, val) => {
			const queryParams = getQueryParams();
			const doesQueryParamKeyExist = doesKeyExist(queryParams, key);

			if (doesQueryParamKeyExist) {
				const existingFilterValues = getQueryParamValuesByKey(queryParams, key);
				const shouldRemoveFilter = existingFilterValues.includes(val);
				let newFilterValues = [];

				if (shouldRemoveFilter) {
					const targetFilterIndex = existingFilterValues.indexOf(val);
					existingFilterValues.splice(targetFilterIndex, 1);
				}
				else {
					existingFilterValues.push(val);
				}

				newFilterValues = existingFilterValues;

				if (!newFilterValues.length) {
					clearQueryParams();
				}
				else {
					setQueryParams(key, newFilterValues.join(","));
				}
			}
			else {
				setQueryParams(key, val);
			}
		};

		return {
			clearQueryParams,
			doesKeyExist,
			getFiltersFromString,
			getQueryParamValuesByKey,
			setQueryParams,
			updateQueryParams
		};
	};

	app.factory('sharedFilters.filterHelperService', ['$location', filterHelpers]);
})();
