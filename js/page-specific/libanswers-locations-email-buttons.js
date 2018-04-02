/*
    This script is used to add a contact form for each branch, that is displayed in the modal.
    Note: This script only needs to be include on the location filter page app
 */
namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.libAnswers = (function initEmailButtons($, constants) {
	const generalContactFormId = constants.libAnswers.generalBranchId;
	const libAnswerWidgetJs = constants.libAnswers.widgetJs;
	const libAnswerCssStyleRule = '.s-la-widget .btn-default';
	let libAnswerIds;
	let moduleOptions;

	const loadScript = (url, callback) => {
		removeScriptByUrl(url); // Remove script id if it exists

		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		document.getElementsByTagName('head')[0].appendChild(script);

		if (callback && typeof callback === 'function') {
			callback();
		}
	};

	const loadScripts = (ids) => {
		ids.forEach((id) => {
			loadScript(`https://api2.libanswers.com/1.0/widgets/${id}`);
		});

		setTimeout(() => {
			removeDuplicateScriptsAndStyles();
		}, 1000);
	};

	const onFilterCardsLoaded = () => {
		loadScripts(libAnswerIds);
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

	const setupContactDiv = (targetSelector, id) => {
		const targetDivHtml = `<div id="s-la-widget-${id}"></div>`;
		const $libAnswerDiv = $(`#s-la-widget-${id}`);
		const $targetDiv = $(targetDivHtml).css('display', 'none');

		if (!$libAnswerDiv.length) {
			$(targetSelector).after($targetDiv);
		}
	};

	const setContactButtonMarkup = (id) => {
		setupContactDiv(moduleOptions.targetSelector, id);
	};

	const onBranchEmailClick = (clickEvent) => {
		clickEvent.preventDefault();

		$(clickEvent.currentTarget)
			.parent()
			.find('[id*="s-la-widget"]')
			.trigger('click');
	};

	const bindEvents = (targetSelector, loadEvent) => {
		$(document)
			.on('click', targetSelector, onBranchEmailClick);

		if (loadEvent) {
			$(document)
				.on(loadEvent, onFilterCardsLoaded);
		}
	};

	const getOptions = (options) => {
		let newOptions = options || {};

		newOptions = options || {};
		newOptions.ids = newOptions.ids || [generalContactFormId];
		newOptions.loadEvent = newOptions.loadEvent || null;
		newOptions.targetSelector = newOptions.targetSelector || '.branch-email';

		return newOptions;
	};

	const init = (options) => {
		moduleOptions = getOptions(options);

		loadScript(libAnswerWidgetJs, () => {
			moduleOptions.ids.forEach(setContactButtonMarkup);

			if (!moduleOptions.loadEvent) {
				loadScripts(moduleOptions.ids);
			}

			bindEvents(moduleOptions.targetSelector, moduleOptions.loadEvent);
		}); // Load the required javascript if it doesn't exist
	};

	return {
		init,
		removeScriptByUrl,
		removeStyleTagByContainingRule
	};
}(jQuery, bcpl.constants));
