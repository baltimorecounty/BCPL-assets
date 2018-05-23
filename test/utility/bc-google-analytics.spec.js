/* eslint-disable no-undef */

describe('Baltimore County Google Analytics Utility', () => {
	describe('isExternalLink', () => {
		it('should return false, if no element is passed in', () => {
			const actual = bcpl.utility.googleAnalytics.isExternalLink();
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain bcpl.info', () => {
			const mockLink = {
				hostname: 'bcpl.info',
				href: 'https://www.bcpl.info'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the subdomain books.bcpl.info', () => {
			const mockLink = {
				hostname: 'books.bcpl.info',
				href: 'https://books.bcpl.info'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain www.bcpl.info', () => {
			const mockLink = {
				hostname: 'www.bcpl.info',
				href: 'https://www.bcpl.info'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain catalog.bcpl.lib.md.us', () => {
			const mockLink = {
				hostname: 'catalog.bcpl.lib.md.us',
				hostname: 'http://catalog.bcpl.lib.md.us'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the subdomain magazines.bcpl.lib.md.us', () => {
			const mockLink = {
				hostname: 'magazines.bcpl.lib.md.us',
				hostname: 'https://magazines.bcpl.lib.md.us'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return true, the link element contains a link containing the domain nba.com', () => {
			const mockLink = {
				hostname: 'nba.com',
				href: 'https://www.nba.com'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});

		it('should return true, the link element contains a link containing the domain www.nba.com', () => {
			const mockLink = {
				hostname: 'nba.com',
				href: 'https://www.nba.com'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});

		it('should return true, the link element contains a malicious link bcpl.info.maliciouswebsite.xxx', () => {
			const mockLink = {
				hostname: 'bcpl.info.maliciouswebsite.xxx',
				href: 'https://bcpl.info.maliciouswebsite.xxx'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});
	});

	describe('isEmptyOrInvalidHref', () => {
		const isEmptyOrInvalidHref = bcpl.utility.googleAnalytics.isEmptyOrInvalidHref;
		it('should return true if the href is null', () => {
			const actual = isEmptyOrInvalidHref();

			expect(actual).toEqual(true)
		});

		it('should return true if the href is undefined', () => {
			const actual = isEmptyOrInvalidHref(undefined);

			expect(actual).toEqual(true)
		});

		it('should return false if the href is an external link', () => {
			const actual = isEmptyOrInvalidHref('https://www.nba.com');

			expect(actual).toEqual(false)
		});

		it('should return false if the href is an internal link', () => {
			const actual = isEmptyOrInvalidHref('https://www.bcpl.info');

			expect(actual).toEqual(false)
		});

		it('should return true if the href contains a standard http javascript link', () => {
			const actual = isEmptyOrInvalidHref('http://javascript;:');

			expect(actual).toEqual(true)
		});

		it('should return true if the href is a standard https javascript link', () => {
			const actual = isEmptyOrInvalidHref('https://javascript;:');

			expect(actual).toEqual(true)
		});

		it('should return false if the href if a link contains the word javascript in it', () => {
			const actual = isEmptyOrInvalidHref('https://javascript-testing.com');

			expect(actual).toEqual(false)
		});

		it('should return true if the href is javascript call to void', () => {
			const actual = isEmptyOrInvalidHref('javascript:void(0);');

			expect(actual).toEqual(true)
		});

		it('should return true if the href is javascript:;', () => {
			const actual = isEmptyOrInvalidHref('javascript:;');

			expect(actual).toEqual(true)
		});

		it('should return true if the href is a custom javascript call', () => {
			const actual = isEmptyOrInvalidHref('javascript:myFunc()');

			expect(actual).toEqual(true)
		});

		it('should return true if the href is custom javascript call with a colon', () => {
			const actual = isEmptyOrInvalidHref('javascript:myFunc();');

			expect(actual).toEqual(true)
		});

		it('should return true if the href is javascript return', () => {
			const actual = isEmptyOrInvalidHref('return false;');

			expect(actual).toEqual(true)
		});
	});
});
