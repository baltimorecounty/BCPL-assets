'use strict';

namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.events = function ($) {
	var activatePost = function activatePost(event) {
		var $target = $(event.currentTarget);
		var $animationTarget = $target.find('.animated');

		$animationTarget.addClass('active');
	};

	var deactivatePost = function deactivatePost(event) {
		var $target = $(event.currentTarget);
		var $animationTarget = $target.find('.animated');

		$animationTarget.removeClass('active');
	};

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);
}(jQuery);