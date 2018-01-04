namespacer('bcpl.pageSpecific.alerts');

bcpl.pageSpecific.alerts = (($, Handlebars, CONSTANTS) => {
	const alertsTemplateSelector = '#alerts-handlebars-template';
	const alertsTargetSelector = '#alerts-handlebars-target';

	const render = (alerts) => {
		const alertsTemplateHtml = $(alertsTemplateSelector).html();

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			const alertsTemplate = Handlebars.compile(alertsTemplateHtml);
			const renderedHtml = alertsTemplate({ alerts });
			$(alertsTargetSelector).html(renderedHtml);
		}
	};

	const getAlertData = (callback) => {
		$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alerts)
			.then(
				alerts => callback(alerts),
				error => console.error(error)
			);
	};

	const init = () => {
		getAlertData(render);
	};

	return {
		init
	};
})(jQuery, Handlebars, bcpl.constants);

$(() => {
	bcpl.pageSpecific.alerts.init();
});
