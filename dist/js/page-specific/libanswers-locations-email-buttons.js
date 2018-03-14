'use strict';

// These scripts are required to be loaded on the page in order to show the
(function initEmailButtons($) {
	var libAnswerIds = [6319, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874, 6875, 6876, 6877, 6878, 6879, 6777, 6880, 6881];

	libAnswerIds.forEach(function (id) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = 'https://api2.libanswers.com/1.0/widgets/' + id;
		head.appendChild(script);
	});
	setTimeout(function () {
		$('.s-la-widget-activator').toArray().forEach(function (widgetElem) {
			var $btn = $(widgetElem);
			var newButtonText = $btn.text();

			newButtonText = 'Contact ' + newButtonText.replace('Email the ', '').replace(' Branch', '');

			$btn.text(newButtonText);
		});
	}, 500);
})(jQuery);