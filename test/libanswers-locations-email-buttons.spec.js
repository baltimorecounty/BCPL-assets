/* eslint-disable no-undef */

/*
    IMPORTANT: These tests have been ignored in the karma.config. This script that thes tests address
    loads a vendor javascript file that triggers an error in the browser. As a result, tests are failing inconsistently.
    Once this issue is resolved, we will re-enable these tests. Issue can be found here
    https://github.com/baltimorecounty/BCPL-assets/issues/336
*/

describe('libAnswers EmailButtons', () => {
	const mockCssRule = '.test ';

	beforeEach((done) => {
		loadFixtures('libanswers-locations-email-buttons.fixture.html');
		done();
	});

	describe('removeStyleTagByContainingRule', () => {
		it(`should remove all scripts containing the css rule: ${mockCssRule}`, (done) => {
			const expectedNumberOfStyles = 0;

			bcpl.libAnswers.removeStyleTagByContainingRule(mockCssRule);

			const actualNumberOfStyles = $(`style:contains("${mockCssRule}")`).length;

			expect(actualNumberOfStyles).toEqual(expectedNumberOfStyles);

			done();
		});

		it(`should NOT remove similar styles thare are like the rule: ${mockCssRule}`, (done) => {
			const expectedNumberOfStyles = 1;

			bcpl.libAnswers.removeStyleTagByContainingRule(mockCssRule);


			const actualNumberOfStyles = $(`style:contains("${mockCssRule.trim()}")`).length;

			expect(actualNumberOfStyles).toEqual(expectedNumberOfStyles);

			done();
		});
	});
	describe('removeScriptByUrl', () => {
		const mockScriptSrc = '//code.jquery.com/jquery-3.3.1.min.js';

		it(`should remove all scripts containing the src: ${mockScriptSrc} if we do not specifiy it's a duplicate`, (done) => {
			const expectedNumberOfScripts = 0;

			bcpl.libAnswers.removeScriptByUrl(mockScriptSrc);

			const actualNumberOfScripts = $(`script[src*="${mockScriptSrc}"]`).length;

			expect(actualNumberOfScripts).toEqual(expectedNumberOfScripts);

			done();
		});

		it(`should remove all but one scripts containing the src: ${mockScriptSrc} if the script is a duplicate`, (done) => {
			const expectedNumberOfScripts = 1;

			bcpl.libAnswers.removeScriptByUrl(mockScriptSrc, true);

			const actualNumberOfScripts = $(`script[src*="${mockScriptSrc}"]`).length;

			expect(actualNumberOfScripts).toEqual(expectedNumberOfScripts);

			done();
		});
	});
});

