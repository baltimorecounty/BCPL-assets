/* eslint-disable no-undef */

// "/base" is a Karma thing. Remove if you're using Jasmine's test runner.
jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('Search and sliding hamburger menu tests', () => {
	describe('killMenuAndModalCover', () => {
		beforeEach((done) => {
			loadFixtures('menuAndModal.fixture.html');
			done();
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

		beforeEach((done) => {
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
			done();
		});

		it('should deactivate the search button', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$searchButtonActivator.hasClass('active')).toBe(false);
		});

		it('should deactivate the search box', () => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$searchBox.hasClass('active')).toBe(false);
		});

		it('should activate the hamburger button', (done) => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect($(sampleEvent.currentTarget).hasClass('active')).toBe(true);

			done();
		});

		it('should activate the menu', (done) => {
			bcpl.navigationSearch.hamburgerButtonClicked(sampleEvent);

			expect(sampleEvent.data.$menu.hasClass('active')).toBe(true);

			done();
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

		beforeEach((done) => {
			loadFixtures('menuAndModal.fixture.html');

			sampleEvent = {
				data: {
					$navAndSearchContainerSelector: $('.nav-and-search'),
					$searchBox: $('#search-box'),
					$searchButtonActivator: $('#activate-search-button'),
					$hamburgerButton: $('#hamburger-menu-button')
				}
			};
			done();
		});

		it('should activate the search box button if the search box is hidden', (done) => {
			$('#search-box').css('display', 'none');

			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#activate-search-button').hasClass('active')).toBe(true);

			done();
		});

		it('should deactivate the hamburger button if the search box is hidden', (done) => {
			$('#search-box').css('display', 'none');

			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#hamburger-menu-button').hasClass('active')).toBe(false);
			done();
		});

		it('should activate the search box if the search box is hidden', (done) => {
			$('#search-box').css('display', 'none');

			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#search-box').hasClass('active')).toBe(true);

			done();
		});

		it('should deactivate the search box button if the search box is visible', (done) => {
			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#activate-search-button').hasClass('active')).toBe(false);
			done();
		});

		it('should activate the hamburger button if the search box is visible', (done) => {
			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);
			expect($('#hamburger-menu-button').hasClass('active')).toBe(true);
			done();
		});

		it('should deactivate the search box if the search box is visible', (done) => {
			bcpl.navigationSearch.searchButtonActivatorClicked(sampleEvent);

			expect($('#search-box').hasClass('active')).toBe(false);
			done();
		});
	});

	describe('searchButtonClicked', () => {
		let sampleEvent = {};

		beforeEach((done) => {
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
			done();
		});

		it('should redirect to a URL including the search terms', () => {
			$('#search-box input').val('ABCDEFG');

			bcpl.navigationSearch.searchButtonClicked(sampleEvent);

			expect(sampleEvent.data.browserWindow.location).toContain('ABCDEFG');
		});
	});
});

describe('windowResized', () => {
	beforeEach((done) => {
		loadFixtures('menuAndModal.fixture.html');

		sampleEvent = {
			data: {
				$menu: $('nav'),
				$modalCover: $('#modal-cover')
			}
		};

		done();
	});

	it('should remove the "animatable" class if the body width is greater than 768px and the nav has the "animatable" class', (done) => {
		$('body').width(1000);
		$('nav').addClass('animatable');

		bcpl.navigationSearch.windowResized(sampleEvent);

		expect($('nav').hasClass('animatable')).toBe(false);
		done();
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
