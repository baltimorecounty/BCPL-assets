namespacer('bcpl.utility');

bcpl.utility.querystringer = (() => {
	/**
	 * Turns the querystring key/value pairs into a dictionary.
	 *
	 * Important: All of the returned dictionary's keys will be lower-cased.
	 */
	const getAsDictionary = (targetWindow) => {
		const windowToUse = targetWindow || window;

		if (windowToUse.location.search) {
			const qs = windowToUse.location.search.slice(1);
			const qsArray = qs.split('&');
			const qsDict = {};

			for (let i = 0; i < qsArray.length; i += 1) {
				const KEY = 0;
				const VALUE = 1;
				const keyValueArr = qsArray[i].split('=');

				qsDict[keyValueArr[KEY].toLowerCase()] = keyValueArr.length === 2 ? keyValueArr[VALUE] : '';
			}

			return qsDict;
		}

		return false;
	};

	return {
		getAsDictionary
	};
})();
