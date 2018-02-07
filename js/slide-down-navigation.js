namespacer('bcpl');

bcpl.slideDownNav = (($) => {
	const slideDownButtonSelector = '.slide-down-nav-item[data-target]';
	const onSlideDownButtonSelectorClick = (clickEvent) => {
		clickEvent.preventDefault();
		const $slideDownButton = $(clickEvent.currentTarget);
		const targetElmId = $slideDownButton.data('target');
		const $targetElm = $(`#${targetElmId}`);
		const isTargetVisbile = $targetElm.is(':visible');
		const downArrowClass = 'fa-angle-down';
		const upArrowClass = 'fa-angle-up';
		const activeClass = 'active';

		if (isTargetVisbile) {
			$targetElm
				.slideUp();

			$slideDownButton
				.removeClass(activeClass)
				.find('i')
					.removeClass(upArrowClass)
					.addClass(downArrowClass);
		}
		else {
			$targetElm.siblings().slideUp(() => {
				$targetElm
					.slideDown();
				
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