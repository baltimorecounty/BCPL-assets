namespacer('bcpl');

bcpl.alertBox = (($, Handlebars, CONSTANTS) => {
	const alertBoxDismissButtonSelector = '#alert-box-dismiss';
	const alertBoxContainerSelector = '.alert-container';

	let $alertBoxDismissButton;
	let $alertBoxContainer;

	const alertBoxDismissButtonClicked = (event) => {
		const $container = event.data.$container;

		$container.addClass('dismissed');
		sessionStorage.setItem('isAlertDismissed', true);
	};

	const renderAlertBox = (alertData) => {
		const alertsTemplateHtml = $('#alerts-template').html();
		const $alertsTarget = $('#alerts-target');

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			const alertsTemplate = Handlebars.compile(alertsTemplateHtml);

			if (alertData && alertData.IsEmergency) {
				alertData.EmergencyClass = 'emergency'; // eslint-disable-line no-param-reassign
			}

			$alertsTarget.html(alertsTemplate({ alertData }));
		}

		displayNotificationBar(!alertData);
	};

	const getAlertDescription = (callback) => {
		if (callback && typeof callback === 'function') {
			$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alertNotification)
				.then(
					(data) => onAlertSuccess(data, callback),
					() => onAlertError(callback)
				);
		} else {
			console.error('A missing or invalid callback has been supplied.');
		}
	};

	const onAlertSuccess = (data, callback) => data ? callback(data, true) : callback(undefined, false);

	const onAlertError = (callback) => callback(undefined, false);

	const hideNotificationBar = ($container) => {
		$container
			.addClass('dismissed')
			.show();
	};

	const displayNotificationBar = (shouldHide) => {
		$alertBoxDismissButton = $(alertBoxDismissButtonSelector);
		$alertBoxContainer = $alertBoxDismissButton.closest(alertBoxContainerSelector);
		$alertBoxDismissButton.on('click', { $container: $alertBoxContainer }, alertBoxDismissButtonClicked);

		const isAlertDismissed = sessionStorage && sessionStorage.getItem('isAlertDismissed');

		if (!isAlertDismissed && !shouldHide) {
			setTimeout(() => {
				$alertBoxContainer.slideDown(250);
			}, 500);
		} else {
			hideNotificationBar($alertBoxContainer);
		}
	};

	const init = () => {
		getAlertDescription(description => renderAlertBox(description));
	};

	return {
		/* test-code */
		alertBoxDismissButtonClicked,
		/* end-test-code */
		init
	};
})(jQuery, Handlebars, bcpl.constants);

$(() => {
	bcpl.alertBox.init();
});
