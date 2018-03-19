namespacer('bcpl.pageSpecific.alerts');

bcpl.pageSpecific.alerts.alertDisplay = (($, Handlebars, moment, CONSTANTS) => {
	const alertsTemplateSelector = '#alerts-handlebars-template';
	const alertsTargetSelector = '#alerts-handlebars-target';
	const dateFormat = 'M/D/YYYY';

	/**
	 * Renders the alerts page.
	 * @param {Object} alerts Alert data from structured content.
	 */
	const render = (alerts) => {
		const alertsTemplateHtml = $(alertsTemplateSelector).html();

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			const alertsTemplate = Handlebars.compile(alertsTemplateHtml);
			const renderedHtml = alertsTemplate(alerts || []);
			$(alertsTargetSelector).html(renderedHtml);
		}
	};

	/**
	 * Gets the alerts data from structured content.
	 * @param {function} callback Callback function for a successful data pull.
	 */
	const getAlertData = (callback) => {
		$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alerts)
			.then(alerts => processAlerts(alerts, callback), processAlerts([], callback));
	};

	/**
	 * Success handler for the ajax call.
	 * @param {Object} alerts Alert data from structured contnet.
	 * @param {function} callback Executed after the start and end dates are fixed up.
	 */
	const processAlerts = (alerts, callback) => {
		const displayAlerts = Array.prototype.slice.call(alerts).map(notification => {
			return Object.assign({
				DisplayStartDate: moment(notification.StartDate).format(dateFormat),
				DisplayEndDate: moment(notification.EndDate).format(dateFormat)
			}, notification);
		});
		callback(displayAlerts);
	};

	/**
	 * Initializes the application.
	 */
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
