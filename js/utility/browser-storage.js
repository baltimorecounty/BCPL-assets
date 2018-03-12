namespacer('bcpl.utility');

bcpl.utility.browserStorage = ((sessionStorage) => {
	/**
	 * Session storage management.
	 * @param {string} key Key for the stored item.
	 * @param {string} [value] Value to set.
	 */
	const session = (key, value) => {
		if (!sessionStorage) {
			return console.error('Session storage is not supported in this browser.');
		}

		if (key && typeof key === 'string') {
			if (value && typeof value === 'string') {
				return setSessionValue(key, value);
			}

			return getSessionValue(key);
		}

		return console.error('Your session storage key must be a string. Nothing stored.');
	};

	/**
	 * Retrieves a value from session storage.
	 * @param {string} key Key for the stored item.
	 */
	const getSessionValue = key => {
		try {
			return sessionStorage.getItem(key);
		} catch (error) {
			return console.error(error);
		}
	};

	/**
	 * Sets a value in session storage.
	 * @param {string} key Key for the stored item.
	 * @param {string} value Value to set.
	 */
	const setSessionValue = (key, value) => {
		try {
			return sessionStorage.setItem(key, value);
		} catch (error) {
			return console.error(error);
		}
	};

	return {
		/* test-code */
		getSessionValue,
		setSessionValue,
		/* end-test-code */
		session
	};
})(sessionStorage);
