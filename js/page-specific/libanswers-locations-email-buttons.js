/*
    This script is used to add a contact form for each branch, that is displayed in the modal.
    Note: This script only needs to be include on the location filter page app
 */
(function initEmailButtons($) {
	const libAnswerIds = [6319, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874, 6875, 6876, 6877, 6878, 6879, 6777, 6880, 6881];
	const loadScript = (url) => {
		removeScriptByUrl(url); // Remove script id if it exists

		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		document.getElementsByTagName('head')[0].appendChild(script);
	};

	const onFilterCardsLoaded = () => {
		libAnswerIds.forEach((id) => {
			loadScript(`https://api2.libanswers.com/1.0/widgets/${id}`);
		});

		setTimeout(() => {
			removeDuplicateScriptsAndStyles();
		}, 1000);
	};

	const removeDuplicateScriptsAndStyles = () => {
		removeScriptByUrl('//api2.libanswers.com/js2.18.5/LibAnswers_widget.min.js', true);
		removeLibAnswersCss();
	};

	const removeLibAnswersCss = () => {
		const targetLibAnswerCssRule = '.s-la-widget .btn-default';
		$(`style:contains(${targetLibAnswerCssRule})`).remove();
	};

	const removeScriptByUrl = (url, isDuplicate) => {
		const selector = isDuplicate ?
			`script[src*="${url}"]:not(:first)` :
			`script[src*="${url}"]`;

		$(selector).remove();
	};

	const onBranchEmailClick = (clickEvent) => {
		clickEvent.preventDefault();

		$(clickEvent.currentTarget)
			.closest('.branch-email-phone-wrapper')
			.find('.branch-location-email-button')
			.find('button')
			.trigger('click');
	};

	$(document)
		.on('click', '.branch-email', onBranchEmailClick)
		.on('bc-filter-cards-loaded', onFilterCardsLoaded);
}(jQuery));
