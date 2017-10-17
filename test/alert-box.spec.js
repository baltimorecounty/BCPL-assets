/* eslint-disable no-undef */

jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('alertBox', () => {
	describe('alertBoxDismissButtonClicked', () => {
		let fakeEvent;

		beforeEach((done) => {
			loadFixtures('alert-box.fixture.html');

			fakeEvent = {
				data: {
					$container: $('.alert-container')
				}
			};
			done();
		});

		it('dismisses the alert box when clicked', () => {
			bcpl.alertBox.alertBoxDismissButtonClicked(fakeEvent);

			expect($('.alert-container').hasClass('dismissed')).toBe(true);
		});
	});
});
