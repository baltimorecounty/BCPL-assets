namespacer('bcpl');

bcpl.contraster = (($, browserStorage) => {
	const contrasterDefaults = {
		styleSheet: {
			high: '/sebin/x/v/master-high-contrast.min.css',
			polaris: '/polaris/custom/themes/bcpl-powerpac/site-high-contrast.css'
		},
		selectors: {
			contrastButton: '#contrastButton',
			stylesheetMaster: '#stylesheetMaster',
			stylesheetMasterHighContrast: '#stylesheetMasterHighContrast',
			toggleText: '.toggle-text'
		}
	};

	const classes = {
		contrasterIsActive: 'contraster-is-active'
	};

	const contrasterSettings = {};

	const localStorageHighContrastKey = 'isHighContrast';
	const isHighContrast = localStorage.getItem(localStorageHighContrastKey) === 'true';
	const isPolaris = window.location.pathname.match('^/polaris/');

	const checkIfElementExists = () => {
		const targetNode = document.getElementById('stylesheetMaster');

		if (!targetNode) {
			window.setTimeout(checkIfElementExists, 0);
			return;
		}

		if (isHighContrast) {
			const highContrastStyleSheet = isPolaris ? contrasterDefaults.styleSheet.polaris : contrasterDefaults.styleSheet.high;
	
			$(contrasterDefaults.selectors.stylesheetMaster).after(`<link id="stylesheetMasterHighContrast" href="${highContrastStyleSheet}" rel="stylesheet">`);
			$('body').addClass(classes.contrasterIsActive);
		}
	};

	checkIfElementExists();

	/**
	 * Handles the click event of the contrast button.
	 */
	const contrastButtonClickHandler = (clickEvent) => {
		const settings = clickEvent.data || contrasterDefaults;
		const $eventTarget = $(clickEvent.currentTarget);

		$('body').toggleClass(classes.contrasterIsActive)

		if ($eventTarget.is(contrasterDefaults.selectors.toggleText)) {
			$eventTarget
				.closest('.contraster')
				.find('input')
				.trigger('click');

			return;
		}

		const $stylesheetMaster = $(settings.selectors.stylesheetMaster);

		if ($stylesheetMaster.length) {
			const $stylesheetMasterHighContrast = $(settings.selectors.stylesheetMasterHighContrast);

			if ($stylesheetMasterHighContrast.length) {
				$stylesheetMasterHighContrast.remove();
				browserStorage.local(localStorageHighContrastKey, 'false');
			} else {
				$stylesheetMaster.after(`<link id="stylesheetMasterHighContrast" href="${settings.styleSheet}" rel="stylesheet">`);
				browserStorage.local(localStorageHighContrastKey, 'true');
			}
		}
	};

	/**
	 * Initializes the contraster with the new stylesheet.
	 * @param {{ stylesheetUrl: string, contrastButtonSelector: string, stylesheetMasterSelector: string, stylesheetMasterHighContrastSelector: string }} options - Options object to set the contraster.
	 */
	const init = (options) => {
		contrasterSettings.styleSheet =
			options.stylesheetUrl && typeof options.stylesheetUrl === 'string'
				? options.stylesheetUrl
				: contrasterDefaults.styleSheet.high;

		contrasterSettings.selectors = {
			contrastButton: options.contrastButtonSelector && typeof options.contrastButtonSelector === 'string'
				? options.contrastButtonSelector
				: contrasterDefaults.selectors.contrastButton,
			stylesheetMaster: options.stylesheetMasterSelector && typeof options.stylesheetMasterSelector === 'string'
				? options.stylesheetMasterSelector
				: contrasterDefaults.selectors.stylesheetMaster,
			stylesheetMasterHighContrast: options.stylesheetMasterHighContrastSelector && typeof options.stylesheetMasterHighContrastSelector === 'string'
				? options.stylesheetMasterHighContrastSelector
				: contrasterDefaults.selectors.stylesheetMasterHighContrast
		};

		const $contrastButton = $(contrasterSettings.selectors.contrastButton);

		if ($contrastButton.length) {
			$contrastButton
				.on('click', contrasterSettings, contrastButtonClickHandler)
				.last()
				.prop('checked', isHighContrast);
		}
	};

	return {
		/* test-code */
		contrastButtonClickHandler,
		/* end-test-code */
		init
	};
})(jQuery, bcpl.utility.browserStorage);
