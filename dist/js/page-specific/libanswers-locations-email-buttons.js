'use strict';

/*
    This script is used to add a contact form for each branch, that is displayed in the modal.
    Note: This script only needs to be include on the location filter page app
 */
(function initEmailButtons($) {
	var libAnswerIds = [6319, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874, 6875, 6876, 6877, 6878, 6879, 6777, 6880, 6881];

	var loadScript = function loadScript(url) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	};

	var onFilterCardsLoaded = function onFilterCardsLoaded() {
		console.log('event triggered');
		libAnswerIds.forEach(function (id) {
			loadScript('https://api2.libanswers.com/1.0/widgets/' + id);
		});
	};

	var onBranchEmailClick = function onBranchEmailClick(clickEvent) {
		clickEvent.preventDefault();

		$(clickEvent.currentTarget).closest('.branch-email-phone-wrapper').find('.branch-location-email-button').find('button').trigger('click');
	};

	$(document).on('click', '.branch-email', onBranchEmailClick);
	$(document).on('bc-filter-cards-loaded', onFilterCardsLoaded);
})(jQuery);