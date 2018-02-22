describe('Smart Side Nav', () => {
	describe('getHrefWithoutQueryString', () => {
		it('should remove the querystring from href', () => {
			const sampleHref = 'https://mydomain.com/testing.html?key=value';
			const expected = 'https://mydomain.com/testing.html';

			const actual = bcpl.smartSideNav.getHrefWithoutQueryString(sampleHref);

			expect(actual).toEqual(expected);
		});

		it('should remove the querystring from  mixed case href', () => {
			const sampleHref = 'https://mYdOmAin.com/TESTing.html?key=value';
			const expected = 'https://mydomain.com/testing.html';

			const actual = bcpl.smartSideNav.getHrefWithoutQueryString(sampleHref);

			expect(actual).toEqual(expected);
		});

		it('should handle empty hrefs and return a falsy value', () => {
			const sampleHref = '';

			const actual = bcpl.smartSideNav.getHrefWithoutQueryString(sampleHref);

			expect(actual).toBeFalsy();
		});
	});

	describe('compareNavLinks', () => {
		let smartSideNav;

		const mockWindow = {
			location: {
				href: 'https://mydomain.com/testing.html'
			}
		};

		beforeEach(() => {
			bcpl.smartSideNav.init(mockWindow);
		});

		it('should return false when there is a match with no querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/testing.html">test</a>');

			expect(actual).toBeFalsy();
		});

		it('should return false when there is a match with a querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/testing.html?one=two">test</a>');

			expect(actual).toBeFalsy();
		});

		it('should return true when there is no match', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://google.com">test</a>');

			expect(actual).toBeTruthy();
		});

		it('should return true when there is no href', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a>test</a>');

			expect(actual).toBeTruthy();
		});
	});
});
