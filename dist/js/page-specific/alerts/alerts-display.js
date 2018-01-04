'use strict';

namespacer('bcpl.pageSpecific.alerts');

bcpl.pageSpecific.alerts = function ($, Handlebars, CONSTANTS) {
	var alertsTemplateSelector = '#alerts-handlebars-template';
	var alertsTargetSelector = '#alerts-handlebars-target';

	var render = function render(alerts) {
		var alertsTemplateHtml = $(alertsTemplateSelector).html();

		if (alertsTemplateHtml && alertsTemplateHtml.length) {
			var alertsTemplate = Handlebars.compile(alertsTemplateHtml);
			var renderedHtml = alertsTemplate({ alerts: alerts });
			$(alertsTargetSelector).html(renderedHtml);
		}
	};

	var getAlertData = function getAlertData(callback) {
		$.ajax(CONSTANTS.baseApiUrl + CONSTANTS.shared.urls.alerts).then(function (alerts) {
			return callback(alerts);
		}, function (error) {
			return console.error(error);
		});
	};

	var init = function init() {
		getAlertData(render);
	};

	return {
		init: init
	};
}(jQuery, Handlebars, bcpl.constants);

$(function () {
	bcpl.pageSpecific.alerts.init();
});