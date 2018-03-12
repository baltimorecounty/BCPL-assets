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

	describe('toggleStylesheet', () => {
		beforeEach((done) => {
			loadFixtures('stylesheet-swapper.fixture.html');
			done();
		});

		it('should be a function', () => {
			const actual = bcpl.stylesheetSwapper.toggleStylesheet;

			expect(typeof actual).toBe('function');
		});

		it('should remove an active stylesheet', () => {
			bcpl.stylesheetSwapper.toggleStylesheet('/example/test3.css');

			const actualMatches = $('link[href~="/example/test3.css"]').length;

			expect(actualMatches).toBe(0);
		});

		it('should add a new stylesheet', () => {
			bcpl.stylesheetSwapper.toggleStylesheet('/example/test-added.css');

			const actualMatches = $('link[href~="/example/test-added.css"]').length;

			expect(actualMatches).toBe(1);
		});
	});
});
