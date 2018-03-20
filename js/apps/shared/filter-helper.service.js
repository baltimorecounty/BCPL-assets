(() => {
	'use strict';

	const app = angular.module('sharedFilters', []);

	const filterHelpers = ($location) => {
		const clearQueryParams = (keys) => {
			let newQueryParams = {};

			if (keys) {
				let queryParams = $location.search();

				keys.forEach((key) => {
					delete queryParams[key];
					newQueryParams = queryParams;
				});
			}

			$location.search(newQueryParams);
		};

		const doesKeyExist = (queryParams, key) => {
			if (!key) return false;

			const matches = Object.keys(queryParams)
				.filter((paramKey) => paramKey.toLowerCase() === key.toLowerCase());

			return !!matches.length;
		};

		// TODO: FILTERS MUST BE A STRING???
		const getFiltersFromString = (filterStr, isDate) => {
			if (!filterStr) return [];

			return filterStr && filterStr.indexOf(',') > -1 ?
				(
					isDate ?
						filterStr :
						filterStr.split(',')
				) :
				[filterStr];
		};

		const getQueryParams = () => $location.search();

		const getQueryParamValuesByKey = (queryParams, key, isDate) => {
			return Object.hasOwnProperty.call(queryParams, key) ?
				getFiltersFromString(queryParams[key], isDate) :
				(isDate ? '' : []);
		};

		const setQueryParams = (keyValueList) => {
			if (!keyValueList) return;

			const queryParam = $location.search();

			keyValueList.forEach((item) => {
				const { key, val } = item;

				if (val) {
					queryParam[key] = val;
				} else {
					delete queryParam[key];
				}
			});

			$location.search(queryParam);
		};

		const updateQueryParams = (keyValueList) => {
			if (!keyValueList) return;

			let paramsToUpdate = [];

			keyValueList.forEach((item) => {
				const { key, val } = item;
				const queryParams = getQueryParams();
				const doesQueryParamKeyExist = doesKeyExist(queryParams, key);

				if (doesQueryParamKeyExist) {
					const existingFilterValues = getQueryParamValuesByKey(queryParams, key);
					const shouldRemoveFilter = existingFilterValues.includes(val);
					let newFilterValues = [];

					if (shouldRemoveFilter) {
						const targetFilterIndex = existingFilterValues.indexOf(val);
						existingFilterValues.splice(targetFilterIndex, 1);
					} else {
						existingFilterValues.push(val);
					}

					newFilterValues = existingFilterValues;

					if (!newFilterValues.length) {
						clearQueryParams([key]);
					} else {
						paramsToUpdate.push({
							key,
							val: newFilterValues.join(',')
						});
					}
				} else {
					paramsToUpdate.push({
						key,
						val
					});
				}
			});
			setQueryParams(paramsToUpdate);
		};

		return {
			clearQueryParams,
			doesKeyExist,
			getFiltersFromString,
			getQueryParams,
			getQueryParamValuesByKey,
			setQueryParams,
			updateQueryParams
		};
	};

	app.factory('sharedFilters.filterHelperService', ['$location', filterHelpers]);
})();
