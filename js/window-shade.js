namespacer('bcpl');

bcpl.windowShade = (($) => {
	const windowShadeSelector = '#window-shade';
	let timeout;

	const cycle = (displaySpeed, delaySpeed) => {
		const $windowShade = $(windowShadeSelector);
		clearTimeout(timeout);
		$windowShade.slideDown(displaySpeed, () => {
			timeout = setTimeout(() => {
				$windowShade.slideUp(displaySpeed);
			}, delaySpeed);
		});
	};

	return {
		cycle
	};
})(jQuery);
