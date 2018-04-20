namespacer('bcpl.utility');

bcpl.utility.windowShade = (($, debounce) => {
	const windowShadeSelector = '#window-shade';
	let timeout;
	let windowShadeDisplaySpeed;
	let windowShadeDelaySpeed;

	const buildWindowShade = (msg) => `<div id="window-shade" style="display: none">
            <p>${msg}</p>
        </div>`;

	const displayShade = ($windowShade) => {
		$windowShade.slideDown(windowShadeDisplaySpeed, () => {
			timeout = setTimeout(() => {
				$windowShade.slideUp(windowShadeDisplaySpeed);
			}, windowShadeDelaySpeed);
		});
	};

	const setShadeSpeeds = (displaySpeed, delaySpeed) => {
		windowShadeDisplaySpeed = displaySpeed || 250;
		windowShadeDelaySpeed = delaySpeed || 2000;
	};

	const cycle = (displaySpeed, delaySpeed) => {
		setShadeSpeeds(displaySpeed, delaySpeed);

		const $windowShade = $(windowShadeSelector);

		clearTimeout(timeout);

		displayShade($windowShade);
	};

	const createShade = (message) => {
		const html = buildWindowShade(message);
		$('body').append(html);
	};

	const cycleWithMessage = (message, displaySpeed, delaySpeed) => {
		setShadeSpeeds(displaySpeed, delaySpeed);

		let $windowShade = $(windowShadeSelector);

		if ($windowShade) {
			$windowShade.remove(); // Remove shade if it exists so we can update the message
		}

		createShade(message);

		$windowShade = $(windowShadeSelector); // We must re-select the dom for the newly created windowShade

		clearTimeout(timeout);

		displayShade($windowShade);
	};


	return {
		cycle,
		cycleWithMessage
	};
})(jQuery);
