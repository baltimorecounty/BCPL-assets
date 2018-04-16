/* eslint-disable no-undef */

describe('Contraster', () => {
	let mockClickEvent;

	beforeEach((done) => {
		loadFixtures('contraster.fixture.html');

		mockClickEvent = {
			currentTarget: $('#contrastButton').get()
		};

		done();
	});

	it('should add a stylesheet that doesn\'t exist to the page', () => {
		bcpl.contraster.contrastButtonClickHandler(mockClickEvent);

		const actual = $('#stylesheetMasterHighContrast').length;

		expect(actual).toBeGreaterThanOrEqual(1);
	});

	it('should remove the high-contrast stylesheet from the page', () => {
		bcpl.contraster.contrastButtonClickHandler(mockClickEvent);
		bcpl.contraster.contrastButtonClickHandler(mockClickEvent);

		const actual = $('#stylesheetMasterHighContrast').length;

		expect(actual).toBe(0);
	});

	it('should set a local storage value to true when adding the high-contrast stylesheet', () => {
		const expected = 'true';
		bcpl.contraster.contrastButtonClickHandler(mockClickEvent);

		const actual = localStorage.getItem('isHighContrast');

		expect(actual).toBe(expected);
	});

	it('should set a local storage value to false when removing the high-contrast stylesheet', () => {
		const expected = 'false';
		bcpl.contraster.contrastButtonClickHandler(mockClickEvent);
		bcpl.contraster.contrastButtonClickHandler(mockClickEvent);

		const actual = localStorage.getItem('isHighContrast');

		expect(actual).toBe(expected);
	});
});
