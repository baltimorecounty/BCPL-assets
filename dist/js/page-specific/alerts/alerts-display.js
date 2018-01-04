'use strict';

namespacer('bcpl.pageSpecific.alerts');

bcpl.pageSpecific.alerts.alertDisplay = function ($, Handlebars, moment, CONSTANTS) {
	var alertsTemplateSelector = '#alerts-handlebars-template';
	var alertsTargetSelector = '#alerts-handlebars-target';
	var dateFormat = 'M/D/YYYY';

	var render = function render(alerts) {
		var alertsTemplateHtml = $(alertsTemplateSelector).html();

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			var alertsTemplate = Handlebars.compile(alertsTemplateHtml);
			var renderedHtml = alertsTemplate(alerts);
			$(alertsTargetSelector).html(renderedHtml);
		}
	};

	var getAlertData = function getAlertData(callback) {
		$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alerts).then(function (alerts) {
			return onAlertsSuccess(alerts, callback);
		}, console.error);
	};

	var onAlertsSuccess = function onAlertsSuccess(alerts, callback) {
		var displayAlerts = alerts.map(function (notification) {
			return Object.assign({
				DisplayStartDate: moment(notification.StartDate).format(dateFormat),
				DisplayEndDate: moment(notification.EndDate).format(dateFormat)
			}, notification);
		});
		callback(displayAlerts);
	};

	var init = function init() {
		getAlertData(render);
	};

	return {
		init: init
	};
}(jQuery, Handlebars, moment, bcpl.constants);

$(function () {
	bcpl.pageSpecific.alerts.alertDisplay.init();
});