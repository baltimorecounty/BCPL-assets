/*
    This script is used to add a contact form for each branch, that is displayed in the modal.
    Note: This script only needs to be include on the location filter page app
 */
namespacer('bcpl.pageSpecific.libAnswers');

bcpl.pageSpecific.libAnswers.emailButtons = (function initEmailButtons($) {
	const libAnswerIds = [6319, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874, 6875, 6876, 6877, 6878, 6879, 6777, 6880, 6881];
	const libAnswerWidgetJs = '//api2.libanswers.com/js2.18.5/LibAnswers_widget.min.js';
	const libAnswerCssStyleRule = '.s-la-widget .btn-default';

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
		removeScriptByUrl(libAnswerWidgetJs, true);
		removeStyleTagByContainingRule(libAnswerCssStyleRule);
	};

	const removeScriptByUrl = (url, isDuplicate) => {
		const selector = isDuplicate ?
			`script[src*="${url}"]:not(:first)` :
			`script[src*="${url}"]`;

		$(selector).remove();
	};

	const removeStyleTagByContainingRule = (rule) => {
		const $style = $(`style:contains(${rule})`);

		$style.toArray().forEach((styleElm) => {
			const $styleElm = $(styleElm);
			const styleContents = $styleElm.html();

			if (styleContents.indexOf(rule) > -1) {
				$styleElm.remove();
			}
		});
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

	return {
		removeScriptByUrl,
		removeStyleTagByContainingRule
	};
}(jQuery));
