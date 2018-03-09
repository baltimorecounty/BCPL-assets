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

			expect(actual.href).toBe(expected);
		});
	});
});
