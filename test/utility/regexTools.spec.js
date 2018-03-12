describe('Regex tools', () => {
	const justWordCharacters = /\w+/g;

	describe('filter', () => {
		it('should filter a string down to values matching the regex', () => {
			const expected = 'qweQWE123123QWEqwe';

			const actual = bcpl.utility.regexTools.filter('qweQWE123@#$@#$@#$123QWEqwe', justWordCharacters);

			expect(actual).toBe(expected);
		});

		it('should return a string unaltered that already matches the regex', () => {
			const expected = 'qweQWE123123QWEqwe';

			const actual = bcpl.utility.regexTools.filter('qweQWE123123QWEqwe', justWordCharacters);

			expect(actual).toBe(expected);
		});

		it('should return an empty string that hax no characters matching the regex', () => {
			const expected = '';

			const actual = bcpl.utility.regexTools.filter('!!!!@@@@####$$$$', justWordCharacters);

			expect(actual).toBe(expected);
		});
	});
});
