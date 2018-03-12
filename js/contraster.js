namespacer('bcpl');

bcpl.contraster = (($, localStorage) => {
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
			localStorage.setItem(localStorageHighContrastKey, masterHref === stylesheets.master.normal);
		}
	};

	const init = () => {
		const $contrastButton = $(selectors.contrastButton);

		if ($contrastButton.length) {
			$contrastButton.on('click', contrastButtonClickHandler);
		}

		if (localStorage.getItem(localStorageHighContrastKey) === 'true') {
			$contrastButton.trigger('click');
		} else {
			localStorage.setItem(localStorageHighContrastKey, 'false');
		}
	};

	return { init };
})(jQuery, localStorage);

$(() => {
	bcpl.contraster.init();
});
