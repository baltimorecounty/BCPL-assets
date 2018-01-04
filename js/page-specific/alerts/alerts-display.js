namespacer('bcpl.pageSpecific.alerts');

bcpl.pageSpecific.alerts.alertDisplay = (($, Handlebars, moment, CONSTANTS) => {
	const alertsTemplateSelector = '#alerts-handlebars-template';
	const alertsTargetSelector = '#alerts-handlebars-target';
	const dateFormat = 'M/D/YYYY';

	const render = (alerts) => {
		const alertsTemplateHtml = $(alertsTemplateSelector).html();

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			const alertsTemplate = Handlebars.compile(alertsTemplateHtml);
			const renderedHtml = alertsTemplate(alerts);
			$(alertsTargetSelector).html(renderedHtml);
		}
	};

	const getAlertData = (callback) => {
		$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alerts)
			.then(
				alerts => onAlertsSuccess(alerts, callback),
				error => console.error(error)
			);
	};

	const onAlertsSuccess = (alerts, callback) => {
		const displayAlerts = alerts.map(notification => {
			return Object.assign({
				DisplayStartDate: moment(notification.StartDate).format(dateFormat),
				DisplayEndDate: moment(notification.EndDate).format(dateFormat)
			}, notification);
		});
		callback(displayAlerts);
	};

	const init = () => {
		getAlertData(render);
	};

	return {
		init
	};
})(jQuery, Handlebars, moment, bcpl.constants);

$(() => {
	bcpl.pageSpecific.alerts.alertDisplay.init();
});
