/* eslint-disable no-undef */

describe('Baltimore County Google Analytics Utility', () => {
	beforeEach((done) => {
		loadFixtures('utiltiy-bc-google-analytics.fixture.html');
		done();
	});

	describe('isExternalLink', () => {
		it('should return false, if no element is passed in', () => {
			const actual = bcpl.utility.googleAnalytics.isExternalLink();
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain bcpl.info', () => {
			const mockLink = {
				hostname: 'bcpl.info'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain www.bcpl.info', () => {
			const mockLink = {
				hostname: 'www.bcpl.info'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return false, the link element contains a link containing the domain catalog.bcpl.lib.md.us', () => {
			const mockLink = {
				hostname: 'catalog.bcpl.lib.md.us'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(false);
		});

		it('should return true, the link element contains a link containing the domain nba.com', () => {
			const mockLink = {
				hostname: 'nba.com'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});

		it('should return true, the link element contains a link containing the domain www.nba.com', () => {
			const mockLink = {
				hostname: 'nba.com'
			};
			const actual = bcpl.utility.googleAnalytics.isExternalLink(mockLink);
			expect(actual).toEqual(true);
		});
	});
});
