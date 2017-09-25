namespacer('bcpl.utility');

bcpl.utility.flexDetect = ((document, $) => {
	const init = () => {
		const hasFlex = document.createElement('div').style.flex !== undefined;

		if (!hasFlex) {
			$('body').addClass('no-flex');
		}
	};

	return { init };
})(document, jQuery);

$(() => {
	bcpl.utility.flexDetect.init();
});
