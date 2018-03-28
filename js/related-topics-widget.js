namespacer('bcpl');

bcpl.relatedTopicsWidget = (($) => {
	const widgetSelector = '.related-topics-widget';
	const secondaryNavSelector = '.secondary-nav';

	const moveWidget = ($widget) => $(secondaryNavSelector).after($widget);
	const showWidget = ($widget) => $widget.removeClass('hidden');
	// OnDocument Ready
	$(() => {
		const $widget = $(widgetSelector);

		if ($widget.length) {
			moveWidget($widget);
			showWidget($widget);
		}
	});
})(jQuery);
