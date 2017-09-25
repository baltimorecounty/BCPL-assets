describe('numericStringTools', () => {
	describe('getIndexOfFirstDigit', () => {
		it('should get the index of the first digit of a currency number string', () => {
			expect(baltimoreCounty.utility.numericStringTools.getIndexOfFirstDigit('$1234')).toBe(1);
		});

		it('should get the index of the first digit of a non-currency number string', () => {
			expect(baltimoreCounty.utility.numericStringTools.getIndexOfFirstDigit('1234')).toBe(0);
		});
	});

	describe('getFirstSetOfNumbersAndRemoveNonDigits ', () => {
		it('should extract numbers as numbers from a string if they start the string', () => {
			expect(baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('1234 monkey cow')).toBe(1234);
		});
	});

	describe('extractNumbersIfPresent ', () => {
		it('should return a number representing a numeric string', () => {
			expect(baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('1234 monkey cow')).toBe(1234);
		});

		it('should return a string representing a non-numeric string', () => {
			expect(baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('monkey cow')).toBe('monkey cow');
		});
	});
});
