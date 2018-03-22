'use strict';

namespacer('bcpl.pageSpecific.alerts');

bcpl.pageSpecific.alerts.alertDisplay = function ($, Handlebars, moment, CONSTANTS) {
	var alertsTemplateSelector = '#alerts-handlebars-template';
	var alertsTargetSelector = '#alerts-handlebars-target';
	var dateFormat = 'M/D/YYYY';

	/**
  * Renders the alerts page.
  * @param {Object} alerts Alert data from structured content.
  */
	var render = function render(alerts) {
		var alertsTemplateHtml = $(alertsTemplateSelector).html();

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			var alertsTemplate = Handlebars.compile(alertsTemplateHtml);
			var renderedHtml = alertsTemplate(alerts || []);
			$(alertsTargetSelector).html(renderedHtml);
		}
	};

	/**
  * Gets the alerts data from structured content.
  * @param {function} callback Callback function for a successful data pull.
  */
	var getAlertData = function getAlertData(callback) {
		$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alerts).then(function (alerts) {
			return onGetAlertsSuccess(alerts, callback);
		}, function () {
			return onGetAlertsError(callback);
		});
	};

	/**
  * Success handler for the ajax call.
  * @param {Object} alerts Alert data from structured contnet.
  * @param {function} callback Executed after the start and end dates are fixed up.
  */
	var onGetAlertsSuccess = function onGetAlertsSuccess(alerts, callback) {
		var displayAlerts = Array.prototype.slice.call(alerts).map(function (notification) {
			return Object.assign({
				DisplayStartDate: moment(notification.StartDate).format(dateFormat),
				DisplayEndDate: moment(notification.EndDate).format(dateFormat)
			}, notification);
		});
		callback(displayAlerts);
	};

	/**
  * Sends bacn an empty array if there's a 500.
  * @param {function} callback Callback function.
  */
	var onGetAlertsError = function onGetAlertsError(callback) {
		callback([]);
	};

	/**
  * Initializes the application.
  */
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