namespacer('bcpl.utility');

/* from https://davidwalsh.name/javascript-debounce-function */
bcpl.utility.debounce = ((func, wait, immediate) => {
	let timeout;

	return function returnMe(func, wait, immediate) {
		const context = this;
		const args = arguments;
		const later = () => {
			timeout = null;

			if (!immediate) {
				func.apply(context, args);
			}
		};

		var callNow = immediate && !timeout;

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args);
		}
	};
})();
