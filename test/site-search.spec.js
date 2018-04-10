/* eslint-disable no-undef */

jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('Site Search', () => {
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

	describe('getSearchTerms', () => {
		let $searchInput;

		beforeEach(() => {
			$searchInput = $('#site-search-input');
		});

		it('should return a single-word search term as-is', () => {
			const expected = 'harry';
			$searchInput.val('harry');

			const actual = bcpl.siteSearch.getSearchTerms();

			expect(actual).toEqual(expected);
		});

		it('should return a single-word search term with no white space at the beginning or end', () => {
			const expected = 'harry';
			$searchInput.val('    harry   ');

			const actual = bcpl.siteSearch.getSearchTerms();

			expect(actual).toEqual(expected);
		});

		it('should encode the space in a two-word search term', () => {
			const expected = 'harry%20potter';
			$searchInput.val('harry potter');

			const actual = bcpl.siteSearch.getSearchTerms();

			expect(actual).toEqual(expected);
		});
	});

	describe('searchCatalog', () => {
		let mockWindow = {
			location: {
				href: ''
			}
		};
		let $searchInput;

		beforeEach(() => {
			$searchInput = $('#site-search-input');
		});

		it('should leave the location blank without a search term', () => {
			const expected = '';

			bcpl.siteSearch.searchCatalog(mockWindow);

			expect(mockWindow.location.href).toEqual(expected);
		});

		it('should try to set the location to the catalog URL with a search term', () => {
			const expected = 'harry%20potter';

			$searchInput.val('harry potter');

			bcpl.siteSearch.searchCatalog(mockWindow);

			const actual = mockWindow.location.href.indexOf(expected) > -1;

			expect(actual).toEqual(true);
		});
	});
});
