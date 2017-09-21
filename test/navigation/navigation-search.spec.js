/* eslint-disable no-undef */

jasmine.getFixtures().fixturesPath = '/test/navigation/fixtures';

describe('Navigation tests', () => {
	describe('killMenuAndModalCover', () => {
		beforeAll(() => {
			loadFixtures('menuAndModal.fixture.html');
		});

		it('should make the modal cover inactive', () => {
			const $menu = $('nav');
			const $modalCover = $('#modal-cover');

			$modalCover.addClass('active');
			$menu.addClass('active move-left');

			bcpl.navigationSearch.killMenuAndModalCover($menu, $modalCover);

			expect($modalCover.hasClass('active')).toBe(false);
		});

		it('should make the menu inactive', () => {
			const $menu = $('nav');
			const $modalCover = $('#modal-cover');

			$modalCover.addClass('active');
			$menu.addClass('active move-left');

			bcpl.navigationSearch.killMenuAndModalCover($menu, $modalCover);

			expect($menu.hasClass('active')).toBe(false);
		});

		it('should make the menu move right', () => {
			const $menu = $('nav');
			const $modalCover = $('#modal-cover');

			$menu.addClass('active move-left');

			bcpl.navigationSearch.killMenuAndModalCover($menu, $modalCover);

			expect($menu.hasClass('move-left')).toBe(false);
		});

		it('should make the opened sub-nav close', () => {
			const $menu = $('nav');
			const $modalCover = $('#modal-cover');
			const $firstList = $menu.find('ul li ul');

			$firstList.addClass('slide-in');

			bcpl.navigationSearch.killMenuAndModalCover($menu, $modalCover);

			expect($firstList.hasClass('slide-in')).toBe(false);
		});
	});

	describe('hamburgerButtonClicked', () => {
		let sampleEvent;

		beforeAll(() => {
			loadFixtures('menuAndModal.fixture.html');

			sampleEvent = {
				data: {
					$menu: $('nav'),
					$searchButtonActivator: $('#activate-search-button'),
					$searchBox: $('#search-box'),
					$modalCover: $('#modal-cover')
				},
				currentTarget: $('#hamburger-menu-button')[0]
			};
		});

		it('should slide-in all sub-navs', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$menu.find('slide-in').length).toBe(0);
		});

		it('should deactivate the search button', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$searchButtonActivator.hasClass('active')).toBe(false);
		});

		it('should deactivate the search box', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$searchBox.hasClass('active')).toBe(false);
		});

		it('should activate the hamburger button', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect($(sampleEvent.currentTarget).hasClass('active')).toBe(true);
		});

		it('should activate the menu', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$menu.hasClass('active')).toBe(true);
		});

		it('should activate the modal cover', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$modalCover.hasClass('active')).toBe(true);
		});
	});

	/*
	const searchButtonActivatorClicked = (event) => {
		const $searchBox = event.data.$searchBox;
		const $searchButtonActivator = event.data.$searchButtonActivator;
		const $hamburgerButton = event.data.$hamburgerButton;

		if ($searchBox.is(':hidden')) {
			$searchButtonActivator.addClass('active');
			$hamburgerButton.removeClass('active');
			$searchBox.addClass('active');
		} else {
			$searchButtonActivator.removeClass('active');
			$hamburgerButton.addClass('active');
			$searchBox.removeClass('active');
		}
	};*/
/*
	describe('searchButtonActivatorClicked', () => {
		let sampleEvent;

		beforeAll(() => {
			loadFixtures('menuAndModal.fixture.html');

			sampleEvent = {
				data: {
					$searchBox: $('#search-box'),
					$searchButtonActivator: $('#activate-search-button'),
					$hamburgerButton: $('#hamburger-menu-button')
				}
			};
		});

		it('should activate the search box button if the search box is hidden', () => {});
		it('should deactivate the hamburger button if the search box is hidden', () => {});
		it('should activate the search box if the search box is hidden', () => {});
		it('should deactivate the search box button if the search box is hidden', () => {});
		it('should activate the hamburger button if the search box is hidden', () => {});
		it('should deactivate the search box if the search box is hidden', () => {});
	});*/
});
