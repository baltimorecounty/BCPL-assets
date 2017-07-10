namespacer("bcpl");

bcpl.alertBox = (($, undefined) => {
	const alertBoxDismissButtonSelector = '#alert-box-dismiss';
	const alertBoxContainerSelector = '.alert-container';

	let $alertBoxDismissButton;
	let $alertBoxContainer;

	const alertBoxDismissButtonClicked = event => {
		const $container = event.data.$container;

		$container.addClass('dismissed');
	};

	const init = () => {
		$alertBoxDismissButton = $(alertBoxDismissButtonSelector);
		$alertBoxContainer = $alertBoxDismissButton.closest(alertBoxContainerSelector);

		$alertBoxDismissButton.on('click', { $container: $alertBoxContainer }, alertBoxDismissButtonClicked);
	};

	return {
		init
	};

})(jQuery);

$(() => {
	bcpl.alertBox.init();
})