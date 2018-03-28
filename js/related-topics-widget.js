namespacer('bcpl');

bcpl.relatedTopicsWidget = (($) => {
	const secondaryNavSelector = '.secondary-nav';
	const widgetSelector = '.related-topics-widget';


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
