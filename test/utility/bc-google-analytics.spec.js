/* eslint-disable no-undef */

describe('Baltimore County Google Analytics Utility', () => {
	const googleAnalytics = bcpl.utility.googleAnalytics;

	describe('isExternalLink', () => {
		it('should return false, if no element is passed in', () => {
			const actual = googleAnalytics.isExternalLink();
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain bcpl.info', () => {
			const mockLink = {
				hostname: 'bcpl.info',
				href: 'https://www.bcpl.info'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the subdomain books.bcpl.info', () => {
			const mockLink = {
				hostname: 'books.bcpl.info',
				href: 'https://books.bcpl.info'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain www.bcpl.info', () => {
			const mockLink = {
				hostname: 'www.bcpl.info',
				href: 'https://www.bcpl.info'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain catalog.bcpl.lib.md.us', () => {
			const mockLink = {
				hostname: 'catalog.bcpl.lib.md.us',
				hostname: 'http://catalog.bcpl.lib.md.us'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the subdomain magazines.bcpl.lib.md.us', () => {
			const mockLink = {
				hostname: 'magazines.bcpl.lib.md.us',
				hostname: 'https://magazines.bcpl.lib.md.us'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return true, the link element contains a link containing the domain nba.com', () => {
			const mockLink = {
				hostname: 'nba.com',
				href: 'https://www.nba.com'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});

		it('should return true, the link element contains a link containing the domain www.nba.com', () => {
			const mockLink = {
				hostname: 'nba.com',
				href: 'https://www.nba.com'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});

		it('should return true, the link element contains a malicious link bcpl.info.maliciouswebsite.xxx', () => {
			const mockLink = {
				hostname: 'bcpl.info.maliciouswebsite.xxx',
				href: 'https://bcpl.info.maliciouswebsite.xxx'
			};
			const actual = googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});
	});

	describe('isEmptyOrInvalidHref', () => {
		const isEmptyOrInvalidHref = googleAnalytics.isEmptyOrInvalidHref;
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

	describe('getDefaultEvent', () => {
		it('should return null if not a default action', () => {
			const mockEvent = {
				action: 'contact',
				category: 'Branch Locations',
				label: 'Arbutus'
			};
			const actual = googleAnalytics.getDefaultEvent(mockEvent);

			expect(actual).toBeNull();
		});
		
		it('should return an object with the key "method" and the value "Polaris"', () => {
			const expected = {
				method: 'Polaris'
			};
			const actual = googleAnalytics.getDefaultEvent({
				action: 'login',
				label: 'Polaris'
			});

			expect(actual).toEqual(expected);
		});

		it('should return an object with the key "method" and the value "Twitter"', () => {
			const expected = {
				method: 'Twitter'
			};
			const actual = googleAnalytics.getDefaultEvent({
				action: 'share',
				label: 'Twitter'
			});

			expect(actual).toEqual(expected);
		});

		it('should return an object with the key "search_term" and the value "book"', () => {
			const expected = {
				search_term: 'book'
			};
			const actual = googleAnalytics.getDefaultEvent({
				action: 'search',
				label: 'book'
			});

			expect(actual).toEqual(expected);
		});

		it('should return an object with the key "search_term" and the value "book"', () => {
			const expected = {
				search_term: 'book'
			};
			const actual = googleAnalytics.getDefaultEvent({
				action: 'view_search_results',
				label: 'book'
			});

			expect(actual).toEqual(expected);
		});
	});

	describe('getStandardEvent', () => {
		it('should return an object with the keys "event_category", "event_label" and the values "bbb", "ccc" respectively', () => {
			const expected = {
				event_category: 'bbb',
				event_label: 'ccc'
			};

			const actual = googleAnalytics.getStandardEvent({
				action: 'aaa',
				category: 'bbb',
				label: 'ccc'
			});

			expect(actual).toEqual(expected);
		});

		it('should return an object with the keys "event_category", "event_label", "value" and the values "bbb", "ccc", 1 respectively', () => {
			const expected = {
				event_category: 'bbb',
				event_label: 'ccc',
				value: 1
			};

			const actual = googleAnalytics.getStandardEvent({
				action: 'aaa',
				category: 'bbb',
				label: 'ccc',
				value: 1
			});

			expect(actual).toEqual(expected);
		});
	});
});
