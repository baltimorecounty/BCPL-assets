namespacer('bcpl');

bcpl.navigation = (($) => {
	const navButtonSelector = '.nav-and-search nav button';
	const navButtonAndListSelector = '.nav-and-search nav li.active button, .nav-and-search nav li.active ul';

	const keyCodes = {
		enter: 13
	};

	const removeActiveClassFromAllButtons = ($button) => $button.closest('ul').find('li.active').removeClass('active');

	const toggleActiveClass = ($button) => $button.closest('li').toggleClass('active');

	const removeActiveClass = ($buttonOrList) => $buttonOrList.closest('.active').removeClass('active');

	const navButtonKeyup = (event) => {
		const $button = $(event.currentTarget);
		const keyCode = event.which || event.keyCode;

		if (keyCode === keyCodes.enter) {
			removeActiveClassFromAllButtons($button);
			toggleActiveClass($button);
		}
	};

	const navButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		removeActiveClassFromAllButtons($button);
		toggleActiveClass($button);
	};

	const navButtonHovered = (event) => {
		const $button = $(event.currentTarget);
		removeActiveClassFromAllButtons($button);
	};

	const navButtonAndListLeave = (event) => {
		const $buttonOrList = $(event.currentTarget);
		removeActiveClass($buttonOrList);
	};

	$(document).on('keyup', navButtonSelector, navButtonKeyup);
	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('mouseenter', navButtonSelector, navButtonHovered);
	$(document).on('mouseleave', navButtonAndListSelector, navButtonAndListLeave);
})(jQuery);
