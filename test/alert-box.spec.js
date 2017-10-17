/* eslint-disable no-undef */

jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('alertBox', () => {
	describe('alertBoxDismissButtonClicked', () => {
		let fakeEvent = {};

		beforeEach(() => {
			loadFixtures('alert-box.fixture.html');

			fakeEvent = {
				data: {
					$container: $('.alert-container')
				}
			};
		});

		it('dismisses the alert box when clicked', () => {
			bcpl.alertBox.alertBoxDismissButtonClicked(fakeEvent);

			expect($('.alert-container').hasClass('dismissed')).toBe(true);
		});
	});
});
