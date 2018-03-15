/* eslint-disable no-undef */
describe('removeStyleTagByContainingRule', () => {
	const mockCssRule = '.test';

	beforeEach((done) => {
		loadFixtures('libanswers-locations-email-buttons.html');
		done();
	});

	it(`should remove all scripts containing the css rule: ${mockCssRule}`, (done) => {
		const expectedNumberOfScripts = 0;

		bcpl.pageSpecific.libAnswers.emailButtons.removeStyleTagByContainingRule(mockCssRule);

		const actualNumberOfScripts = $('head').find(`style:contains("${mockCssRule}")`).length;

		expect(actualNumberOfScripts).toEqual(expectedNumberOfScripts);

		done();
	});
});
