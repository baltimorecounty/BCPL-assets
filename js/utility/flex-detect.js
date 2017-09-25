namespacer('bcpl.utility');

bcpl.utility.flexDetect = ((document, $) => {
	const init = (testDoc) => {
		const actualDoc = testDoc || document;

		const hasFlex = actualDoc.createElement('div').style.flex !== undefined;

		if (!hasFlex) {
			$('body').addClass('no-flex');
		}
	};

	return { init };
})(document, jQuery);

$(() => {
	bcpl.utility.flexDetect.init();
});
