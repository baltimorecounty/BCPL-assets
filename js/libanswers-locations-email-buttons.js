/*
    This script is used to add a contact form for each branch, that is displayed in the modal.
    Note: This script only needs to be include on the location filter page app
 */
namespacer("bcpl");

bcpl.libAnswers = (function libAnswers($, constants) {
  const generalContactFormId = constants.libAnswers.generalBranchId;
  const libAnswerCssStyleRule = ".s-la-widget .btn-default";

  let moduleOptions;

  const bindEvents = (targetSelector, loadEvent) => {
    $(document).on("click", targetSelector, onBranchEmailClick);

    if (loadEvent) {
      $(document).on(loadEvent, onFilterCardsLoaded);
    }
  };

  const getOptions = (options) => {
    let newOptions = options || {};

    newOptions.ids = newOptions.ids || [generalContactFormId];
    newOptions.loadEvent = newOptions.loadEvent || null;
    newOptions.targetSelector = newOptions.targetSelector || ".branch-email";

    return newOptions;
  };

  const loadScript = (url, callback) => {
    removeScriptByUrl(url); // Remove script id if it exists

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    document.getElementsByTagName("head")[0].appendChild(script);

    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const loadScripts = (ids) => {
    ids.forEach((id) => {
      loadScript(`https://bcpl.libanswers.com/1.0/widgets/${id}`);
    });

    setTimeout(() => {
      removeDuplicateScriptsAndStyles();
    }, 1000);
  };

  const onBranchEmailClick = (clickEvent) => {
    clickEvent.preventDefault();

    $(clickEvent.currentTarget)
      .parent()
      .find('[id*="s-la-widget"]')
      .trigger("click");
  };

  const onFilterCardsLoaded = () => {
    loadScripts(moduleOptions.ids);
  };

  const removeDuplicateScriptsAndStyles = () => {
    removeStyleTagByContainingRule(libAnswerCssStyleRule);
  };

  const removeScriptByUrl = (url, isDuplicate) => {
    const selector = isDuplicate
      ? `script[src*="${url}"]:not(:first)`
      : `script[src*="${url}"]`;

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

  const init = (options) => {
    moduleOptions = getOptions(options);

    if (!moduleOptions.loadEvent) {
      loadScripts(moduleOptions.ids);
    }

    bindEvents(moduleOptions.targetSelector, moduleOptions.loadEvent);
  };

  return {
    init,
    removeScriptByUrl,
    removeStyleTagByContainingRule,
  };
})(jQuery, bcpl.constants);

(function onReady($) {
  $(document).ready(() => {
    bcpl.libAnswers.init();
  });
})(jQuery);
