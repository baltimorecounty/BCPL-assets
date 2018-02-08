namespacer('bcpl');

bcpl.slideDownNav = (($) => {
	const slideDownButtonSelector = '.slide-down-nav-item[data-target]';
	const downArrowClass = 'fa-angle-down';
	const upArrowClass = 'fa-angle-up';
	const activeClass = 'active';
	const animatationInterval = 500;

	const deactivateSlideDownButton = ($btns) => {
		$btns
			.removeClass(activeClass)
			.find('i')
				.removeClass(upArrowClass)
				.addClass(downArrowClass);
	};

	const onSlideDownButtonSelectorClick = (clickEvent) => {
		clickEvent.preventDefault();
		const $slideDownButton = $(clickEvent.currentTarget);
		const targetElmId = $slideDownButton.data('target');
		const $targetElm = $(`#${targetElmId}`);
		const isTargetVisbile = $targetElm.is(':visible');

		if (isTargetVisbile) {
			$targetElm
				.slideUp(animatationInterval);

			deactivateSlideDownButton($slideDownButton);
		}
		else {
			$targetElm.siblings().slideUp(animatationInterval, () => {
				$targetElm
					.slideDown(animatationInterval);

				deactivateSlideDownButton($slideDownButton.siblings());
				
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