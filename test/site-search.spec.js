/* eslint-disable no-undef */

jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('Site Search', () => {
	const siteSearch = bcpl.siteSearch;

	beforeEach((done) => {
		loadFixtures('site-search.fixture.html');
		$('#activate-search-button').trigger('click');
		done();
	});

	describe('Search Tabs', () => {
		it('target item should not have an active prior to selecting it', () => {
			const $targetElm = $('.search-button-website');
			const hasActiveClass = $targetElm.hasClass('active');

			expect(hasActiveClass).toBe(false);
		});

		it('target item should have an active after it is selected', () => {
			const $targetElm = $('.search-button-website');

			$targetElm.trigger('click');

			const hasActiveClass = $targetElm.hasClass('active');
			expect(hasActiveClass).toBe(true);
		});

		it('target item should be the only class that has an active class', () => {
			const $targetElm = $('.search-button-website');

			$targetElm.trigger('click');

			const hasActiveClass = $targetElm.siblings().hasClass('active');
			expect(hasActiveClass).toBe(false);
		});
	});

	describe('Clearing the Search Field', () => {
		let $searchInput;

		beforeEach((done) => {
			$searchInput = $('#site-search-input');

			$searchInput
				.val('test')
				.trigger('keyup');

			done();
		});

		it('should show the clear icon when text is entered', () => {
			const isClearButtonVisible = $('#site-search-input .fa-times').is(':visible');
			expect(isClearButtonVisible).toEqual(true);
		});

		it('should not show the search icon when text is entered', () => {
			const isClearButtonVisible = $('#site-search-input .fa-search').is(':visible');
			expect(isClearButtonVisible).toEqual(false);
		});

		it('should clear the input\'s value after the clear button is selected', () => {
			$('#site-search-input .fa-times').trigger('click');

			const hasSearchValue = !!$searchInput.val();
			expect(hasSearchValue).toEqual(false);
		});
	});
});
