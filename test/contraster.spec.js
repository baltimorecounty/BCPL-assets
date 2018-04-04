/* eslint-disable no-undef */

describe('Contraster', () => {
	beforeEach((done) => {
		loadFixtures('contraster.fixture.html');
		done();
	});

	it('should add a stylesheet that doesn\'t exist to the page', () => {
		bcpl.contraster.contrastButtonClickHandler();

		const actual = $('#stylesheetMasterHighContrast').length;

		expect(actual).toBeGreaterThanOrEqual(1);
	});

	it('should remove the high-contrast stylesheet from the page', () => {
		bcpl.contraster.contrastButtonClickHandler();
		bcpl.contraster.contrastButtonClickHandler();

		const actual = $('#stylesheetMasterHighContrast').length;

		expect(actual).toBe(0);
	});

	it('should set a local storage value to true when adding the high-contrast stylesheet', () => {
		const expected = 'true';
		bcpl.contraster.contrastButtonClickHandler();

		const actual = localStorage.getItem('isHighContrast');

		expect(actual).toBe(expected);
	});

	it('should set a local storage value to false when removing the high-contrast stylesheet', () => {
		const expected = 'false';
		bcpl.contraster.contrastButtonClickHandler();
		bcpl.contraster.contrastButtonClickHandler();

		const actual = localStorage.getItem('isHighContrast');

		expect(actual).toBe(expected);
	});
});
