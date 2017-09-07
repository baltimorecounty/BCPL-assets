namespacer('bcpl.pageSpecific.homepage');

bcpl.pageSpecific.homepage.events = (($) => {
	const activatePost = (event) => {
		const $target = $(event.currentTarget);
		const $animationTarget = $target.find('.animated');

		$animationTarget.addClass('active');
	};

	const deactivatePost = (event) => {
		const $target = $(event.currentTarget);
		const $animationTarget = $target.find('.animated');

		$animationTarget.removeClass('active');
	};

	$(document).on('mouseover', '.post', activatePost);
	$(document).on('mouseout', '.post', deactivatePost);
})(jQuery);
