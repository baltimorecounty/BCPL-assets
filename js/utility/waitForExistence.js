namespacer('bcpl.utility');

bcpl.utility.waitForExistence = (() => {
	return (selector, callback) => {
		const checkForExistenceInterval = setInterval(() => {
			if ($(selector).length) {
				clearInterval(checkForExistenceInterval);
				if (callback && typeof callback === 'function') {
					callback();
				}
			}
		}, 100);
	}
})();
