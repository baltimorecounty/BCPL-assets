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

	const hideSearchBox = () => {
		$('#activate-search-button, #search-box').removeClass('active');
	};

	const equalizeListItems = ($childOfTargetList) => {
		const $wideList = $childOfTargetList.siblings('ul');
		const $listItems = $wideList.find('li');
		let widest = 0;
		let tallest = 0;

		if ($listItems.length < 8) return;

		$listItems.each((listItemIndex, listItem) => {
			const $listItem = $(listItem);
			widest = $listItem.width() > widest ? $listItem.width() : widest;
			tallest = $listItem.height() > tallest ? $listItem.height() : tallest;
		});

		$listItems.width(widest);
		$listItems.height(tallest);
		$wideList.addClass('wide');
	};

	const navButtonKeyup = (event) => {
		const $button = $(event.currentTarget);
		const keyCode = event.which || event.keyCode;

		if (keyCode === keyCodes.enter) {
			hideSearchBox();
			removeActiveClassFromAllButtons($button);
			toggleActiveClass($button);
			equalizeListItems($button);
		}
	};

	const navButtonClicked = (event) => {
		const $button = $(event.currentTarget);
		hideSearchBox();
		removeActiveClassFromAllButtons($button);
		toggleActiveClass($button);
		equalizeListItems($button);
	};

	const navButtonHovered = (event) => {
		const $button = $(event.currentTarget);
		hideSearchBox();
		removeActiveClassFromAllButtons($button);
		equalizeListItems($button);
	};

	const navButtonAndListLeave = (event) => {
		const $buttonOrList = $(event.currentTarget);
		hideSearchBox();
		removeActiveClass($buttonOrList);
	};

	$(document).on('keyup', navButtonSelector, navButtonKeyup);
	$(document).on('click', navButtonSelector, navButtonClicked);
	$(document).on('mouseenter', navButtonSelector, navButtonHovered);
	$(document).on('mouseleave', navButtonAndListSelector, navButtonAndListLeave);
})(jQuery);
