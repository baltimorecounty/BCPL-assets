namespacer('bcpl');

bcpl.relatedTopicsWidget = (($) => {
	const widgetSelector = '.related-topics-widget';
	$(function onReady() {
		const $widget = $(widgetSelector);

		if ($widget.length) {
			$widget.removeClass('hidden');
		}
	});
})(jQuery);
