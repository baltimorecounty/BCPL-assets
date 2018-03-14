namespacer('bcpl.utility');

bcpl.utility.browserStorage = ((localStorage) => {
	/**
	 * Local storage management.
	 * @param {string} key Key for the stored item.
	 * @param {string} [value] Value to set.
	 */
	const local = (key, value) => {
		if (!localStorage) {
			return console.error('Local storage is not supported in this browser.');
		}

		if (key && typeof key === 'string') {
			if (value && typeof value === 'string') {
				return setLocalValue(key, value);
			}

			return getLocalValue(key);
		}

		return console.error('Your local storage key must be a string. Nothing stored.');
	};

	/**
	 * Retrieves a value from local storage.
	 * @param {string} key Key for the stored item.
	 */
	const getLocalValue = key => {
		try {
			return localStorage.getItem(key);
		} catch (error) {
			return console.error(error);
		}
	};

	/**
	 * Sets a value in local storage.
	 * @param {string} key Key for the stored item.
	 * @param {string} value Value to set.
	 */
	const setLocalValue = (key, value) => {
		try {
			return localStorage.setItem(key, value);
		} catch (error) {
			return console.error(error);
		}
	};

	return {
		/* test-code */
		getLocalValue,
		setLocalValue,
		/* end-test-code */
		local
	};
})(localStorage);
