namespacer('bcpl');

bcpl.slideDownNav = (($) => {
	const slideDownButtonSelector = '.slide-down-nav-item[data-target]';
	const onSlideDownButtonSelectorClick = (clickEvent) => {
		clickEvent.preventDefault();
		const $slideDownButton = $(clickEvent.currentTarget);
		const targetElmId = $slideDownButton.data('target');
		const $targetElm = $(`#${targetElmId}`);
		const $closestContainer = $targetElm.closest('.container');
		const isTargetVisbile = $targetElm.is(':visible');
		const downArrowClass = 'fa-angle-down';
		const upArrowClass = 'fa-angle-up';
		const activeClass = 'active';
		const animatationInterval = 500;

		if (isTargetVisbile) {
			$targetElm
				.slideUp(animatationInterval);

			$slideDownButton
				.removeClass(activeClass)
				.find('i')
					.removeClass(upArrowClass)
					.addClass(downArrowClass);

		}
		else {
			$targetElm.siblings().slideUp(animatationInterval, () => {
				$targetElm
					.slideDown(animatationInterval);
				
				$slideDownButton
					.siblings()
						.removeClass(activeClass)
						.find('i')
							.removeClass(upArrowClass)
							.addClass(downArrowClass);

				$slideDownButton
					.addClass(activeClass)
						.find('i')
						.removeClass(downArrowClass)
						.addClass(upArrowClass);

			});
		}
	};

	$(document).on('click', slideDownButtonSelector, onSlideDownButtonSelectorClick);
})(jQuery);