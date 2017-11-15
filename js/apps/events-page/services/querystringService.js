((app) => {
	const querystringService = () => {
		const build = (querystringSettings) => {
			if (!querystringSettings) {
				return '';
			}

			const enumeratedProperties = Object.entries(querystringSettings);
			const propertyNameIndex = 0;
			const propertyValueIndex = 1;
			let querystring = '';

			if (enumeratedProperties.length) {
				angular.forEach(enumeratedProperties, (property) => {
					querystring += `${property[propertyNameIndex]}=${property[propertyValueIndex]}&`;
				});
			}

			return querystring;
		};

		return {
			build
		};
	};

	app.factory('querystringService', querystringService);
})(angular.module('eventsPageApp'));
