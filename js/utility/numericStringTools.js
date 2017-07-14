namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.numericStringTools = (() => {
	/*
		* We want to consider the column text to be a number if it starts with a dollar
		* sign, so let's peek at the first character and see if that's the case.
		* Don't worry, if it's just a normal number, it's handled elsewhere.
		*/
	const getIndexOfFirstDigit = (numberString) => {
		const startsWithCurrencyRegex = /[$]/;
		return startsWithCurrencyRegex.test(numberString[0]) && numberString.length > 1 ? 1 : 0;
	};

	/*
	* Is the first character of the value in question a number (without the dollar sign, if present)?
	* If so, return the value as an actual number, rather than a string of numbers.
	*/
	const extractNumbersIfPresent = (stringOrNumber) => {
		const firstCharacterIndex = getIndexOfFirstDigit(stringOrNumber);
		const stringOrNumberPossiblyWithoutFirstCharacter = stringOrNumber.slice(firstCharacterIndex);
		const firstSetOfNumbers = getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumberPossiblyWithoutFirstCharacter);
		return typeof firstSetOfNumbers === 'number' ? firstSetOfNumbers : stringOrNumber;
	};

	/*
		* Here, we're converting the first group of characters to a number, so we can sort
		* numbers numerically, rather than alphabetically.
		*/
	const getFirstSetOfNumbersAndRemoveNonDigits = (numbersAndAssortedOtherCharacters) => {
		const allTheDigitsRegex = /^\.{0,1}(\d+[,.]{0,1})*\d+\b/;
		const extractedNumerics = numbersAndAssortedOtherCharacters.match(allTheDigitsRegex);
		return extractedNumerics ? parseFloat(extractedNumerics[0].split(',').join('')) : numbersAndAssortedOtherCharacters;
	};

	return {
		getIndexOfFirstDigit,
		extractNumbersIfPresent,
		getFirstSetOfNumbersAndRemoveNonDigits,
	};
})();
