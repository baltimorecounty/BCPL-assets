/* eslint-disable no-undef, no-console */

describe('Browser storage', () => {
	describe('session', () => {
		beforeEach(() => {
			spyOn(console, 'error');
		});

		it('should write a new value to browser sessionStorage', () => {
			const expected = '12345';
			bcpl.utility.browserStorage.session('test1', '12345');

			const actual = sessionStorage.getItem('test1');

			expect(actual).toBe(expected);
		});

		it('should read a value from session storage', () => {
			const expected = '12345';
			sessionStorage.setItem('test1', '12345');

			const actual = bcpl.utility.browserStorage.session('test1');

			expect(actual).toBe(expected);
		});

		it('should read a value from session storage when supplied a non-string value', () => {
			const expected = '12345';

			sessionStorage.setItem('test1', '12345');
			const actual = bcpl.utility.browserStorage.session('test1', {});

			expect(actual).toBe(expected);
		});

		it('should display an error in the console when the key is a blank string', () => {
			bcpl.utility.browserStorage.session('');

			expect(console.error).toHaveBeenCalled();
		});

		it('should display an error in the console when the key is not a string', () => {
			bcpl.utility.browserStorage.session([]);

			expect(console.error).toHaveBeenCalled();
		});
	});

	describe('getSessionValue', () => {
		beforeEach(() => {
			spyOn(console, 'error');
		});

		it('should return a session value', () => {
			const expected = '12345';
			sessionStorage.setItem('test2', '12345');

			const actual = bcpl.utility.browserStorage.getSessionValue('test2');

			expect(actual).toBe(expected);
		});
	});

	describe('setSessionValue', () => {
		it('should set a session value for a supplied key', () => {
			const expected = '12345';

			bcpl.utility.browserStorage.setSessionValue('test3', '12345');
			const actual = sessionStorage.getItem('test3');

			expect(actual).toBe(expected);
		});
	});
});
