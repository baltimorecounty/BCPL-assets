/* eslint-disable no-undef */

jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('Stylesheet swapper', () => {
	it('should be an object', () => {
		const actual = bcpl.stylesheetSwapper;

		expect(actual).toBeTruthy();
	});

	describe('getLinkTagByHref', () => {
		beforeEach((done) => {
			loadFixtures('stylesheet-swapper.fixture.html');
			done();
		});

		it('should be a function', () => {
			const actual = bcpl.stylesheetSwapper.getLinkTagByHref;

			expect(typeof actual).toBe('function');
		});

		it('should locate a link tag by url', () => {
			const expected = '/example/test1.css';

			const actual = bcpl.stylesheetSwapper.getLinkTagByHref('/example/test1.css');

			expect(actual.attributes.href.value).toBe(expected);
		});

		it('should return null when provided a blank href', () => {
			const expected = null;

			const actual = bcpl.stylesheetSwapper.getLinkTagByHref('');

			expect(actual).toBe(expected);
		});

		it('should return null when provided a null href', () => {
			const expected = null;

			const actual = bcpl.stylesheetSwapper.getLinkTagByHref(null);

			expect(actual).toBe(expected);
		});

		it('should return null when provided a undefined href', () => {
			const expected = null;

			const actual = bcpl.stylesheetSwapper.getLinkTagByHref(undefined);

			expect(actual).toBe(expected);
		});

		it('should return null when provided a whitespace href', () => {
			const expected = null;

			const actual = bcpl.stylesheetSwapper.getLinkTagByHref('          ');

			expect(actual).toBe(expected);
		});
	});

	describe('swapLinkHrefs', () => {
		beforeEach((done) => {
			loadFixtures('stylesheet-swapper.fixture.html');
			done();
		});

		it('should be a function', () => {
			const actual = bcpl.stylesheetSwapper.swapLinkHrefs;

			expect(typeof actual).toBe('function');
		});

		it('should swap links from a found href', () => {
			const targetHref = '/example/test2.css';
			const expected = '/example/test-swapped.css';

			const newLinkTag = bcpl.stylesheetSwapper.swapLinkHrefs(targetHref, expected);

			expect(newLinkTag.attributes.href.value).toBe(expected);
		});

		it('should return null when provided a falsy targetHref', () => {
			const targetHref = undefined;
			const expected = null;

			const newLinkTag = bcpl.stylesheetSwapper.swapLinkHrefs(targetHref, expected);

			expect(newLinkTag).toBe(expected);
		});

		it('should return null when provided a falsy newHref', () => {
			const targetHref = '/example/test2.css';
			const expected = null;

			const newLinkTag = bcpl.stylesheetSwapper.swapLinkHrefs(targetHref, expected);

			expect(newLinkTag).toBe(expected);
		});
	});
});
