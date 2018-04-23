namespacer('bcpl.utility');

bcpl.utility.debounce = (() => {
	return (fn, time) => {
		let timeout;

		return function innerDebounce() {
			const functionCall = () => fn.apply(this, arguments);

			clearTimeout(timeout);
			timeout = setTimeout(functionCall, time);
		};
	};
})();

