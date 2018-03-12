namespacer('bcpl');

bcpl.contraster = (($, browserStorage) => {
	const selectors = {
		contrastButton: '#contrastButton',
		stylesheetMaster: '#stylesheetMaster',
		stylesheetMasterHighContrast: '#stylesheetMasterHighContrast'
	};

	const stylesheets = {
		master: {
			normal: '/sebin/h/f/master.min.css',
			high: '/sebin/x/v/master-high-contrast.min.css'
		}
	};

	const localStorageHighContrastKey = 'isHighContrast';

	const contrastButtonClickHandler = () => {
		const $stylesheetMaster = $(selectors.stylesheetMaster);

		if ($stylesheetMaster.length) {
			const $stylesheetMasterHighContrast = $(selectors.stylesheetMasterHighContrast);

			if ($stylesheetMasterHighContrast.length) {
				$stylesheetMasterHighContrast.remove();
				browserStorage.local(localStorageHighContrastKey, 'false');
			} else {
				$stylesheetMaster.after(`<link id="stylesheetMasterHighContrast" href="${stylesheets.master.high}" rel="stylesheet">`);
				browserStorage.local(localStorageHighContrastKey, 'true');
			}
		}
	};

	const init = () => {
		const $contrastButton = $(selectors.contrastButton);

		if ($contrastButton.length) {
			$contrastButton.on('click', contrastButtonClickHandler);
		}

		if (browserStorage.local(localStorageHighContrastKey) === 'true') {
			$contrastButton.trigger('click');
		} else {
			browserStorage.local(localStorageHighContrastKey, 'false');
		}
	};

	return {
		/* test-code */
		contrastButtonClickHandler,
		/* end-test-code */
		init
	};
})(jQuery, bcpl.utility.browserStorage);

$(() => {
	bcpl.contraster.init();
});
