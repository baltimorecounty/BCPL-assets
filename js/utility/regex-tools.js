namespacer('bcpl.utility');

bcpl.utility.regexTools = (() => {
	/**
	 * Filters a string down to only characters that match the regex.
	 *
	 * @param {string} stringToFilter
	 * @param {RegExp} filterRegex
	 */
	const removeMatchingCharacters = (stringToFilter, filterRegex) => {
		let match;
		const matches = [];

		/* eslint-disable no-cond-assign */
		while ((match = filterRegex.exec(stringToFilter)) !== null) {
			matches.push(match[0]);
		}

		return matches.join('');
	};

	return { removeMatchingCharacters };
})();
