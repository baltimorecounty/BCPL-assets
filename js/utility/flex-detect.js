namespacer('seniorExpo.utility');

seniorExpo.utility.flexDetect = ((document, $) => {
	const init = () => {
		const hasFlex = document.createElement('div').style.flex !== undefined;

		if (!hasFlex) {
			$('body').addClass('no-flex');
		}
	};

	return { init };
})(document, jQuery);

$(() => {
	seniorExpo.utility.flexDetect.init();
});
