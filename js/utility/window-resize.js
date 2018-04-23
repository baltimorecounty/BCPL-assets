namespacer('bcpl.utility');

bcpl.utility.windowResize = ((debounce) => {
	return (fn) => {
		window.addEventListener('resize', debounce(fn, 250));
	};
})(bcpl.utility.debounce);
