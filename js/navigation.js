namespacer('bcpl');

bcpl.navigation = (($, keyCodes) => {
	const navButtonSelector = '.nav-and-search nav button';


	const findClosestButtonToLink = ($link) => $link.closest('nav>ul>li').find('button');

	const focusFirstActiveMenuLink = () => $('nav li.active a').first().focus();

	const activateSubmenu = ($button) =>
		$button
			.attr('aria-expanded', true)
			.closest('li')
			.addClass('active clicked')
			.find('ul')
			.attr('aria-hidden', false);

	const deactivateSubmenu = ($button) =>
		$button
			.attr('aria-expanded', false)
			.closest('li')
			.removeClass('active clicked')
			.find('ul')
			.attr('aria-hidden', true);

	const removeActiveClassFromAllButtons = () => deactivateSubmenu($('nav').find('li.active button'));

	const hideSearchBox = () => $('#activate-search-button, #search-box').removeClass('active');

	const hideHeroCallout = (shouldHide) => shouldHide ? $('.hero-callout-container').hide() : $('.hero-callout-container').show();

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

		switch (keyCode) {
		case keyCodes.escape:
			deactivateSubmenu($('nav li.active button'));
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
			removeActiveClassFromAllButtons();
			keyboardEvent.preventDefault();
			activateSubmenu($button);
			$button
				.siblings('.submenu-wrapper')
				.find('a')
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
		const $allActiveLinks = $link.closest('.active, .clicked').find('a');

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
			if ($link.closest('nav>ul>li').prev('li').length) {
				deactivateSubmenu(findClosestButtonToLink($link));
				activateSubmenu($link.closest('nav>ul>li').prev('li').find('button'));
				focusFirstActiveMenuLink();
			}
			break;
		case keyCodes.downArrow:
			keyboardEvent.preventDefault();
			$allActiveLinks.eq($allActiveLinks.index($link) + 1).focus();
			break;
		case keyCodes.rightArrow:
			keyboardEvent.preventDefault();
			if ($link.closest('nav>ul>li').next('li').length) {
				deactivateSubmenu(findClosestButtonToLink($link));
				activateSubmenu($link.closest('nav>ul>li').next('li').find('button'));
				focusFirstActiveMenuLink();
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

	const navigationButtonHovered = (mouseEvent) => {
		const $button = $(mouseEvent.currentTarget);
		deactivateSubmenu($button.closest('ul').find('button'));
		activateSubmenu($button);
	};

	const navigationMouseleave = (mouseEvent) => {
		if (!$(mouseEvent.relatedTarget).closest('nav').length) {
			removeActiveClassFromAllButtons();
		}
	};

	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('keydown', 'nav', navigationKeyPressed);
	$(document).on('keydown', 'nav button', navigationButtonKeyPressed);
	$(document).on('mouseover', 'nav button', navigationButtonHovered);
	$(document).on('keydown', 'nav a', navigationMenuItemKeyPressed);
	$(document).on('mouseleave', 'nav, nav *', navigationMouseleave);
})(jQuery, bcpl.constants.keyCodes);
