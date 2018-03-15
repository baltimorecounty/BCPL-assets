/* eslint-disable no-undef */

describe('removeStyleTagByContainingRule', () => {
	const mockCssRule = '.test ';

	beforeEach((done) => {
		loadFixtures('libanswers-locations-email-buttons.fixture.html');
		done();
	});

	it(`should remove all scripts containing the css rule: ${mockCssRule}`, (done) => {
		const expectedNumberOfScripts = 0;

		bcpl.pageSpecific.libAnswers.emailButtons.removeStyleTagByContainingRule(mockCssRule);

		console.log('fixture-head', $('head style').html());

		const actualNumberOfScripts = $('#fixture-head').find(`style:contains("${mockCssRule}")`).length;

		expect(actualNumberOfScripts).toEqual(expectedNumberOfScripts);

		done();
	});

	it(`should NOT remove similar styles thare are like the rule: ${mockCssRule}`, (done) => {
		const expectedNumberOfScripts = 1;

		bcpl.pageSpecific.libAnswers.emailButtons.removeStyleTagByContainingRule(mockCssRule);

		const actualNumberOfScripts = $('#fixture-head').find(`style:contains("${mockCssRule.trim()}")`).length;

		expect(actualNumberOfScripts).toEqual(expectedNumberOfScripts);

		done();
	});
});
