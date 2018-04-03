/* eslint-disable no-undef */
describe('libAnswers EmailButtons', () => {
	const mockCssRule = '.test ';

	beforeEach((done) => {
		loadFixtures('libanswers-locations-email-buttons.fixture.html');
		done();
	});

	describe('removeStyleTagByContainingRule', () => {
		it(`should remove all scripts containing the css rule: ${mockCssRule}`, (done) => {
			const expectedNumberOfStyles = 0;

			bcpl.pageSpecific.libAnswers.removeStyleTagByContainingRule(mockCssRule);

			const actualNumberOfStyles = $(`style:contains("${mockCssRule}")`).length;

			expect(actualNumberOfStyles).toEqual(expectedNumberOfStyles);

			done();
		});

		it(`should NOT remove similar styles thare are like the rule: ${mockCssRule}`, (done) => {
			const expectedNumberOfStyles = 1;

			bcpl.pageSpecific.libAnswers.removeStyleTagByContainingRule(mockCssRule);


			const actualNumberOfStyles = $(`style:contains("${mockCssRule.trim()}")`).length;

			expect(actualNumberOfStyles).toEqual(expectedNumberOfStyles);

			done();
		});
	});
	describe('removeScriptByUrl', () => {
		const mockScriptSrc = '//code.jquery.com/jquery-3.3.1.min.js';

		it(`should remove all scripts containing the src: ${mockScriptSrc} if we do not specifiy it's a duplicate`, (done) => {
			const expectedNumberOfScripts = 0;

			bcpl.pageSpecific.libAnswers.removeScriptByUrl(mockScriptSrc);

			const actualNumberOfScripts = $(`script[src*="${mockScriptSrc}"]`).length;

			expect(actualNumberOfScripts).toEqual(expectedNumberOfScripts);

			done();
		});

		it(`should remove all but one scripts containing the src: ${mockScriptSrc} if the script is a duplicate`, (done) => {
			const expectedNumberOfScripts = 1;

			bcpl.pageSpecific.libAnswers.removeScriptByUrl(mockScriptSrc, true);

			const actualNumberOfScripts = $(`script[src*="${mockScriptSrc}"]`).length;

			expect(actualNumberOfScripts).toEqual(expectedNumberOfScripts);

			done();
		});
	});
});

