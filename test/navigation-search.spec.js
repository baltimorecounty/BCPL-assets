/* eslint-disable no-undef */

// "/base" is a Karma thing. Remove if you're using Jasmine's test runner.
jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('Search and sliding hamburger menu tests', () => {
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

		it('should remove the "nav-visible" class from the body', () => {
			const $menu = $('nav');
			const $modalCover = $('#modal-cover');
			$('body').addClass('nav-visible');

			bcpl.navigationSearch.killMenuAndModalCover($menu, $modalCover);

			expect($('body').hasClass('nav-visible')).toBe(false);
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

		it('should add the "nav-visible" class to the body', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect($('body').hasClass('nav-visible')).toBe(true);
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

	describe('windowResized', () => {
		beforeEach(() => {
			loadFixtures('menuAndModal.fixture.html');

			sampleEvent = {
				data: {
					$menu: $('nav'),
					$modalCover: $('#modal-cover')
				}
			};
		});

		it('should remove the "animatable" class if the body width is greater than 768px and the nav has the "animatable" class', () => {
			$('body').width(1000);
			$('nav').addClass('animatable');

			bcpl.navigationSearch.windowResized(sampleEvent);

			expect($('nav').hasClass('animatable')).toBe(false);
		});

		it('should add the "animatable" class if the body width is greater than 768px and the nav does not have the "animatable" class', (done) => {
			$('body').width(1000);

			bcpl.navigationSearch.windowResized(sampleEvent, () => {
				expect($('nav').hasClass('animatable')).toBe(true);
				done();
			});
		});

		it('should add the "animatable" class if the body width is less than 768px', (done) => {
			$('body').width(500);
			$('nav').removeClass('animatable');

			bcpl.navigationSearch.windowResized(sampleEvent, () => {
				expect($('nav').hasClass('animatable')).toBe(true);
				done();
			});
		});

		it('should add the "animatable" class if the body width is equal to 768px', (done) => {
			$('body').width(768);
			$('nav').removeClass('animatable');

			bcpl.navigationSearch.windowResized(sampleEvent, () => {
				expect($('nav').hasClass('animatable')).toBe(true);
				done();
			});
		});
	});
});
