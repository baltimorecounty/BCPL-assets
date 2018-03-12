/* eslint-disable no-undef, no-console */

describe('Browser storage', () => {
	describe('session', () => {
		beforeEach(() => {
			spyOn(console, 'error');
		});

		it('should write a new value to browser localStorage', () => {
			const expected = '12345';
			bcpl.utility.browserStorage.local('test1', '12345');

			const actual = localStorage.getItem('test1');

			expect(actual).toBe(expected);
		});

		it('should read a value from local storage', () => {
			const expected = '12345';
			localStorage.setItem('test1', '12345');

			const actual = bcpl.utility.browserStorage.local('test1');

			expect(actual).toBe(expected);
		});

		it('should read a value from local storage when supplied a non-string value', () => {
			const expected = '12345';

			localStorage.setItem('test1', '12345');
			const actual = bcpl.utility.browserStorage.local('test1', {});

			expect(actual).toBe(expected);
		});

		it('should display an error in the console when the key is a blank string', () => {
			bcpl.utility.browserStorage.local('');

			expect(console.error).toHaveBeenCalled();
		});

		it('should display an error in the console when the key is not a string', () => {
			bcpl.utility.browserStorage.local([]);

			expect(console.error).toHaveBeenCalled();
		});
	});

	describe('getSessionValue', () => {
		beforeEach(() => {
			spyOn(console, 'error');
		});

		it('should return a localStorage value', () => {
			const expected = '12345';
			localStorage.setItem('test2', '12345');

			const actual = bcpl.utility.browserStorage.getLocalValue('test2');

			expect(actual).toBe(expected);
		});
	});

	describe('setSessionValue', () => {
		it('should set a localStorage value for a supplied key', () => {
			const expected = '12345';

			bcpl.utility.browserStorage.setLocalValue('test3', '12345');
			const actual = localStorage.getItem('test3');

			expect(actual).toBe(expected);
		});
	});
});
