describe('Smart Side Nav', () => {
	describe('compareNavLinks - filename', () => {
		const mockWindow = {
			location: {
				href: 'https://mydomain.com/abcde/testing.html'
			}
		};

		beforeEach(() => {
			bcpl.smartSideNav.init(mockWindow);
		});

		it('should return false when there is a match with no querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/abcde/testing.html">test</a>');

			expect(actual).toBeFalsy();
		});

		it('should return false when there is a match with a querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/abcde/testing.html?one=two">test</a>');

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

	describe('compareNavLinks - trailing slash', () => {
		const mockWindow = {
			location: {
				href: 'https://mydomain.com/abcde/fghijk/'
			}
		};

		beforeEach(() => {
			bcpl.smartSideNav.init(mockWindow);
		});

		it('should return false when there is a match with no querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/abcde/fghijk/index.html">test</a>');

			expect(actual).toBeFalsy();
		});

		it('should return false when there is a match with a querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/abcde/fghijk/index.html?one=two">test</a>');

			expect(actual).toBeFalsy();
		});
	});

	describe('compareNavLinks - foldername', () => {
		const mockWindow = {
			location: {
				href: 'https://mydomain.com/abcde/fghijk'
			}
		};

		beforeEach(() => {
			bcpl.smartSideNav.init(mockWindow);
		});

		it('should return false when there is a match with no querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/abcde/fghijk/index.html">test</a>');

			expect(actual).toBeFalsy();
		});

		it('should return false when there is a match with a querystring', () => {
			const actual = bcpl.smartSideNav.compareNavLinks(0, '<a href="https://mydomain.com/abcde/fghijk/index.html?one=two">test</a>');

			expect(actual).toBeFalsy();
		});
	});
});
