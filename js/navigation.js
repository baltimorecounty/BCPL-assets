namespacer('bcpl');

bcpl.navigation = (($) => {
	const navButtonSelector = '.nav-and-search nav button';
	const navButtonAndListSelector = '.nav-and-search nav button, .nav-and-search nav ul li ul li a';

	const keyCodes = {
		enter: 13
	};

	const removeActiveClassFromAllButtons = ($button) => $button.closest('ul').find('li.active').removeClass('active');

	const toggleActiveClass = ($button) => $button.closest('li').toggleClass('active');

	const removeActiveClass = ($buttonOrList) => $buttonOrList.closest('.active').removeClass('active');

	const hideSearchBox = () => $('#activate-search-button, #search-box').removeClass('active');

	const hideHeroCallout = (shouldHide) => shouldHide ? $('.hero-callout-container').hide() : $('.hero-callout-container').show();

	const navButtonKeyup = (event) => {
		const $button = $(event.currentTarget);
		const keyCode = event.which || event.keyCode;

		hideSearchBox();

		if (keyCode === keyCodes.enter) {
			removeActiveClassFromAllButtons($button);
		}

		hideHeroCallout(true);
	};

	const navButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		hideSearchBox();
		removeActiveClassFromAllButtons($button);
		toggleActiveClass($button);
		hideHeroCallout(true);
	};

	const navButtonHovered = (event) => {
		const $button = $(event.currentTarget);
		hideSearchBox();
		removeActiveClassFromAllButtons($button);
		toggleActiveClass($button);
		hideHeroCallout($('nav:hover, nav ul li:hover').length);
	};

	const navButtonAndListLeave = (event) => {
		const $buttonOrList = $(event.currentTarget);
		hideSearchBox();
		removeActiveClass($buttonOrList);
		hideHeroCallout($('nav:hover, nav ul li:hover').length);
	};

	$(document).on('keyup', navButtonSelector, navButtonKeyup);
	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('mouseenter', navButtonSelector, navButtonHovered);
	$(document).on('mouseleave', navButtonAndListSelector, navButtonAndListLeave);
})(jQuery);
