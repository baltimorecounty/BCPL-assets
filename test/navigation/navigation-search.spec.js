/* eslint-disable no-undef */

jasmine.getFixtures().fixturesPath = 'base/test/navigation/fixtures';

describe('Navigation tests', () => {
	describe('killMenuAndModalCover', () => {
		beforeEach(() => {
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

		beforeEach(() => {
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

	describe('searchButtonActivatorClicked', () => {
		let sampleEvent;

		beforeEach(() => {
			loadFixtures('menuAndModal.fixture.html');

			sampleEvent = {
				data: {
					$searchBox: $('#search-box'),
					$searchButtonActivator: $('#activate-search-button'),
					$hamburgerButton: $('#hamburger-menu-button')
				}
			};
		});

		it('should activate the search box button if the search box is hidden', () => {
			$('#search-box').css('display', 'none');

			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#activate-search-button').hasClass('active')).toBe(true);
		});

		it('should deactivate the hamburger button if the search box is hidden', () => {
			$('#search-box').css('display', 'none');

			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#hamburger-menu-button').hasClass('active')).toBe(false);
		});

		it('should activate the search box if the search box is hidden', () => {
			$('#search-box').css('display', 'none');

			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#search-box').hasClass('active')).toBe(true);
		});

		it('should deactivate the search box button if the search box is visible', () => {
			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#activate-search-button').hasClass('active')).toBe(false);
		});

		it('should activate the hamburger button if the search box is visible', () => {
			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);
			expect($('#hamburger-menu-button').hasClass('active')).toBe(true);
		});

		it('should deactivate the search box if the search box is visible', () => {
			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#search-box').hasClass('active')).toBe(false);
		});
	});

	describe('searchButtonClicked', () => {
		let sampleEvent = {};

		beforeEach(() => {
			loadFixtures('menuAndModal.fixture.html');

			sampleEvent.currentTarget = '#search-button';
			sampleEvent.data = {
				browserWindow: {
					location: ''
				}
			};
			bcpl.constants = {
				basePageUrl: ''
			};
		});

		it('should redirect to a URL including the search terms', () => {
			$('#search-box input').val('ABCDEFG');

			bcpl.navigationSearch.searchButtonClicked(sampleEvent);

			expect(sampleEvent.data.browserWindow.location).toContain('ABCDEFG');
		});
	});

	describe('menuItemClicked', () => {
		let sampleEvent = {};

		beforeEach(() => {
			loadFixtures('menuAndModal.fixture.html');

			sampleEvent = {
				data: {
					$menu: $('nav')
				},
				currentTarget: 'nav ul li:first-child button'
			};
		});

		it('should slide out any active menu', () => {
			$('nav ul li ul').addClass('slide-in');

			bcpl.navigationSearch.menuItemClicked(sampleEvent);

			expect($('nav ul li:nth-child(3) ul').hasClass('slide-in')).toBe(false);
		});

		it('should move the main menu over to the left', () => {
			bcpl.navigationSearch.menuItemClicked(sampleEvent);

			expect($('nav').hasClass('move-left')).toBe(true);
		});

		it('should slide in the submenu', () => {
			bcpl.navigationSearch.menuItemClicked(sampleEvent);

			expect($('nav ul li:first-child ul').hasClass('slide-in')).toBe(true);
		});
	});
});
