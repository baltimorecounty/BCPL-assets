namespacer('bcpl');

bcpl.alertBox = (($) => {
	const alertBoxDismissButtonSelector = '#alert-box-dismiss';
	const alertBoxContainerSelector = '.alert-container';

	let $alertBoxDismissButton;
	let $alertBoxContainer;

	const alertBoxDismissButtonClicked = (event) => {
		const $container = event.data.$container;

		$container.addClass('dismissed');
		sessionStorage.setItem('isAlertDismissed', true);
	};

	const init = () => {
		$alertBoxDismissButton = $(alertBoxDismissButtonSelector);
		$alertBoxContainer = $alertBoxDismissButton.closest(alertBoxContainerSelector);
		$alertBoxDismissButton.on('click', { $container: $alertBoxContainer }, alertBoxDismissButtonClicked);

		if ((sessionStorage && !sessionStorage.getItem('isAlertDismissed')) || !sessionStorage) {
			setTimeout(() => {
				$alertBoxContainer.slideDown(250);
			}, 500);
		}
	};

	return {
		init,
	};
})(jQuery);

$(() => {
	bcpl.alertBox.init();
});
