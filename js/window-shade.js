namespacer('bcpl');

bcpl.windowShade = (($) => {
	const windowShadeSelector = '#window-shade';

	const cycle = (displaySpeed, delaySpeed) => {
		const $windowShade = $(windowShadeSelector);

		$windowShade.slideDown(displaySpeed, () => {
			setTimeout(() => {
				$windowShade.slideUp(displaySpeed);
			}, delaySpeed);
		});
	};

	return {
		cycle
	};
})(jQuery);
