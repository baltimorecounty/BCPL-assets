/* eslint-disable no-undef */

describe('BreadCrumbs', () => {
	let $breadCrumbs;
	let $hiddenBreadCrumbs;
	beforeEach((done) => {
		loadFixtures('breadcrumbs.fixture.html');

		$breadCrumbs = bcpl.breadCrumbs.$getBreadCrumbs();
		$hiddenBreadCrumbs = bcpl.breadCrumbs.$getBreadCrumbsToHide($breadCrumbs);

		done();
	});

	it('should remove all non breaking spaces from the breadcrumbs', () => {
		bcpl.breadCrumbs.cleanBreadCrumbs();

		const actual = $('.breadcrumbs-wrapper').html().indexOf('&nbsp;') > -1;
		const expected = false;

		expect(actual).toEqual(expected);
	});

	it('should retrieve an array of breadcrumbs from the page (jQuery)', () => {
		const actual = $breadCrumbs && $breadCrumbs.length === 4;
		const expected = true;

		expect(actual).toEqual(expected);
	});

	it('should retrieve an array of breadcrumbs from that we want to hide from the user (jQuery)', () => {
		const actual = $hiddenBreadCrumbs && $hiddenBreadCrumbs.length === 2;
		const expected = true;

		expect(actual).toEqual(expected);
	});

	it('should hide the proper number of breadcrumbs (jQuery)', () => {
		bcpl.breadCrumbs.collapseBreadCrumbs($hiddenBreadCrumbs);

		const actualVisibleBreadCrumbs = $('.breadcrumb:visible').length;
		const expectedVisibleBreadCrumbs = 2;

		expect(actualVisibleBreadCrumbs).toEqual(expectedVisibleBreadCrumbs);
	});
});
