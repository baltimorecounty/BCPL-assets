namespacer('bcpl');

bcpl.navigation = (($, keyCodes) => {
	const navButtonSelector = '#responsive-sliding-navigation button';
	const closestMenuNodeSelector = '#responsive-sliding-navigation>ul>li';
	const searchArtifactsSelector = '#activate-search-button, #search-box';
	const heroCalloutContainerSelector = '.hero-callout-container';
	const activeLinksSelector = '.active, .clicked';
	const activeMenuButtonSelector = 'li.active button';
	const mobileWidthThreshold = 768;

	const isMobileWidth = () => parseFloat($('body').width()) <= mobileWidthThreshold;

	const isSlideNavigationVisible = () => $('body').hasClass('nav-visible');

	const focusFirstActiveMenuLink = () => $('#responsive-sliding-navigation li.active a').first().focus();


	const findClosestButtonToLink = ($link) => $link.closest(closestMenuNodeSelector).find('button');

	const activateSubmenu = ($button, afterAnimationCallback) => {
		const animationOptions = isSlideNavigationVisible() ? { right: '0px' } : {};
		const animationSpeed = isSlideNavigationVisible() ? 250 : 0;
		$button
			.attr('aria-expanded', true)
			.closest('li')
			.addClass('active')
			.find('.submenu-wrapper')
			.animate(animationOptions, animationSpeed, function afterAnimation() {
				$(this)
					.find('ul')
					.attr('aria-hidden', false);

				if (afterAnimationCallback && typeof afterAnimationCallback === 'function') {
					afterAnimationCallback();
				}
			});
	};

	const deactivateSubmenu = ($button, afterAnimationCallback) => {
		const animationOptions = isSlideNavigationVisible() ? { right: '-300px' } : {};
		const animationSpeed = isSlideNavigationVisible() ? 250 : 0;
		$button
			.siblings('.submenu-wrapper')
			.animate(animationOptions, animationSpeed, function afterAnimation() {
				$(this)
					.siblings('button')
					.attr('aria-expanded', false)
					.closest('li')
					.removeClass('active')
					.attr('aria-hidden', true);

				if (afterAnimationCallback && typeof afterAnimationCallback === 'function') {
					afterAnimationCallback();
				}
			});
	};

	const removeActiveClassFromAllButtons = () => deactivateSubmenu($('#responsive-sliding-navigation').find(activeMenuButtonSelector));

	const hideSearchBox = () => $(searchArtifactsSelector).removeClass('active');

	const hideHeroCallout = (shouldHide) => {
		if (shouldHide && !isMobileWidth()) {
			$(heroCalloutContainerSelector).hide();
		} else {
			$(heroCalloutContainerSelector).show();
		}
	};

	const navButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		const isActive = $button.closest('li').hasClass('active');
		hideSearchBox();
		removeActiveClassFromAllButtons();
		if (!isActive) {
			activateSubmenu($button);
			hideHeroCallout(true);
		} else {
			deactivateSubmenu($button);
			hideHeroCallout(false);
		}
	};

	const navigationKeyPressed = (keyboardEvent) => {
		const keyCode = keyboardEvent.which || keyboardEvent.keyCode;
		const $button = $(keyboardEvent.currentTarget).closest('#responsive-sliding-navigation').find(activeMenuButtonSelector);

		switch (keyCode) {
		case keyCodes.escape:
			deactivateSubmenu($button);
			$button.focus();
			hideHeroCallout(false);
			break;
		default:
			break;
		}
	};

	const navigationButtonKeyPressed = (keyboardEvent) => {
		const keyCode = keyboardEvent.which || keyboardEvent.keyCode;
		const $button = $(keyboardEvent.currentTarget);

		switch (keyCode) {
		case keyCodes.rightArrow:
			keyboardEvent.preventDefault();
			deactivateSubmenu($button);
			$button
				.parent()
				.next()
				.find('button')
				.focus();
			break;
		case keyCodes.leftArrow:
			keyboardEvent.preventDefault();
			deactivateSubmenu($button);
			$button
				.parent()
				.prev()
				.find('button')
				.focus();
			break;
		case keyCodes.downArrow:
		case keyCodes.upArrow:
		case keyCodes.enter:
			keyboardEvent.preventDefault();
			removeActiveClassFromAllButtons();
			activateSubmenu($button);
			$button
				.siblings('.submenu-wrapper')
				.find('a:visible')
				.first()
				.focus();
			break;
		default:
			break;
		}
	};

	const navigationMenuItemKeyPressed = (keyboardEvent) => {
		const keyCode = keyboardEvent.which || keyboardEvent.keyCode;
		const $link = $(keyboardEvent.currentTarget);
		const $allActiveLinks = $link.closest(activeLinksSelector).find('a:visible');
		const $button = findClosestButtonToLink($link);

		switch (keyCode) {
		case keyCodes.upArrow:
			keyboardEvent.preventDefault();
			if ($allActiveLinks.index($link) - 1 === -1) {
				$allActiveLinks.eq(0).focus();
			} else {
				$allActiveLinks.eq($allActiveLinks.index($link) - 1).focus();
			}
			break;
		case keyCodes.leftArrow:
			keyboardEvent.preventDefault();
			if ($link.closest(closestMenuNodeSelector).prev('li').length) {
				deactivateSubmenu($button, () => {
					activateSubmenu($link.closest(closestMenuNodeSelector).prev('li').find('button'));
					focusFirstActiveMenuLink();
				});
			}
			break;
		case keyCodes.downArrow:
			keyboardEvent.preventDefault();
			$allActiveLinks.eq($allActiveLinks.index($link) + 1).focus();
			break;
		case keyCodes.rightArrow:
			keyboardEvent.preventDefault();
			if ($link.closest(closestMenuNodeSelector).next('li').length) {
				deactivateSubmenu($button, () => {
					activateSubmenu($link.closest(closestMenuNodeSelector).next('li').find('button'));
					focusFirstActiveMenuLink();
				});
			}
			break;
		case keyCodes.space:
		case keyCodes.enter:
			keyboardEvent.preventDefault();
			$link[0].click();
			removeActiveClassFromAllButtons();
			break;
		default:
			break;
		}
	};

	const navigationMouseover = () => {
		hideHeroCallout(true);
	};

	const navigationMouseleave = (mouseEvent) => {
		const isNextElementANavElement = $(mouseEvent.relatedTarget).closest('#responsive-sliding-navigation').length;

		if (!isNextElementANavElement && !isMobileWidth()) {
			removeActiveClassFromAllButtons();
			hideHeroCallout(false);
		}
	};

	$(document).on('mouseover', '#responsive-sliding-navigation, #responsive-sliding-navigation *', navigationMouseover);
	$(document).on('mouseleave', '#responsive-sliding-navigation, #responsive-sliding-navigation *', navigationMouseleave);
	$(document).on('keydown', '#responsive-sliding-navigation button', navigationButtonKeyPressed);
	$(document).on('keydown', '#responsive-sliding-navigation', navigationKeyPressed);
	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('keydown', '#responsive-sliding-navigation a', navigationMenuItemKeyPressed);
})(jQuery, bcpl.constants.keyCodes);
