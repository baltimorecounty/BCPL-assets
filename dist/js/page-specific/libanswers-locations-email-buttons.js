'use strict';

/*
    This script is used to add a contact form for each branch, that is displayed in the modal.
    Note: This script only needs to be include on the location filter page app
 */
namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.libAnswers = function initEmailButtons($, constants) {
	var generalContactFormId = constants.libAnswers.generalBranchId;
	var libAnswerWidgetJs = constants.libAnswers.widgetJs;
	var libAnswerCssStyleRule = '.s-la-widget .btn-default';
	var libAnswerIds = void 0;
	var moduleOptions = void 0;

	var loadScript = function loadScript(url, callback) {
		removeScriptByUrl(url); // Remove script id if it exists

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		document.getElementsByTagName('head')[0].appendChild(script);

		if (callback && typeof callback === 'function') {
			callback();
		}
	};

	var loadScripts = function loadScripts(ids) {
		ids.forEach(function (id) {
			loadScript('https://api2.libanswers.com/1.0/widgets/' + id);
		});

		setTimeout(function () {
			removeDuplicateScriptsAndStyles();
		}, 1000);
	};

	var onFilterCardsLoaded = function onFilterCardsLoaded() {
		loadScripts(libAnswerIds);
	};

	var removeDuplicateScriptsAndStyles = function removeDuplicateScriptsAndStyles() {
		removeScriptByUrl(libAnswerWidgetJs, true);
		removeStyleTagByContainingRule(libAnswerCssStyleRule);
	};

	var removeScriptByUrl = function removeScriptByUrl(url, isDuplicate) {
		var selector = isDuplicate ? 'script[src*="' + url + '"]:not(:first)' : 'script[src*="' + url + '"]';

		$(selector).remove();
	};

	var removeStyleTagByContainingRule = function removeStyleTagByContainingRule(rule) {
		var $style = $('style:contains(' + rule + ')');

		$style.toArray().forEach(function (styleElm) {
			var $styleElm = $(styleElm);
			var styleContents = $styleElm.html();

			if (styleContents.indexOf(rule) > -1) {
				$styleElm.remove();
			}
		});
	};

	var setupContactDiv = function setupContactDiv(targetSelector, id) {
		var targetDivHtml = '<div id="s-la-widget-' + id + '"></div>';
		var $libAnswerDiv = $('#s-la-widget-' + id);
		var $targetDiv = $(targetDivHtml).css('display', 'none');

		if (!$libAnswerDiv.length) {
			$(targetSelector).after($targetDiv);
		}
	};

	var setContactButtonMarkup = function setContactButtonMarkup(id) {
		setupContactDiv(moduleOptions.targetSelector, id);
	};

	var onBranchEmailClick = function onBranchEmailClick(clickEvent) {
		clickEvent.preventDefault();

		$(clickEvent.currentTarget).parent().find('[id*="s-la-widget"]').trigger('click');
	};

	var bindEvents = function bindEvents(targetSelector, loadEvent) {
		$(document).on('click', targetSelector, onBranchEmailClick);

		if (loadEvent) {
			$(document).on(loadEvent, onFilterCardsLoaded);
		}
	};

	var getOptions = function getOptions(options) {
		var newOptions = options || {};

		newOptions = options || {};
		newOptions.ids = newOptions.ids || [generalContactFormId];
		newOptions.loadEvent = newOptions.loadEvent || null;
		newOptions.targetSelector = newOptions.targetSelector || '.branch-email';

		return newOptions;
	};

	var init = function init(options) {
		moduleOptions = getOptions(options);

		loadScript(libAnswerWidgetJs, function () {
			moduleOptions.ids.forEach(setContactButtonMarkup);

			if (!moduleOptions.loadEvent) {
				loadScripts(moduleOptions.ids);
			}

			bindEvents(moduleOptions.targetSelector, moduleOptions.loadEvent);
		}); // Load the required javascript if it doesn't exist
	};

	return {
		init: init,
		removeScriptByUrl: removeScriptByUrl,
		removeStyleTagByContainingRule: removeStyleTagByContainingRule
	};
}(jQuery, bcpl.constants);