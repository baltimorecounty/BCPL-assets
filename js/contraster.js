namespacer('bcpl');

bcpl.contraster = (($, browserStorage) => {
	const selectors = {
		contrastButton: '#contrastButton',
		stylesheetMaster: '#stylesheetMaster'
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
			let masterHref = $stylesheetMaster.attr('href');
			$stylesheetMaster.attr('href', masterHref === stylesheets.master.normal ? stylesheets.master.high : stylesheets.master.normal);
			browserStorage.local(localStorageHighContrastKey, masterHref === stylesheets.master.normal);
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

	return { init };
})(jQuery, bcpl.utility.browserStorage);

$(() => {
	bcpl.contraster.init();
});
