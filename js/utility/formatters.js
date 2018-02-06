namespacer('bcpl.utility');

bcpl.utility.format = (function () {
	'use strict';

	function formatCurrency(input) {
		if (!input) {
			return;
		}

		if (input && typeof input === 'string') {
			input = parseFloat(input);
		}

		var currencyFormatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
			// the default value for minimumFractionDigits depends on the currency
			// and is usually already 2
		});

		return currencyFormatter.format(input);
	}

	function formatPhoneNumber(input, format) {
		if (typeof input === 'number') {
			input = input.toString();
		}

		var exp = /\d+/g;
		var numbersOnly = input.match(exp).join('').split('');
		var numberOfXs = format.split('').filter(function (char) {
			return char === 'x';
		}).length;
		var hasOneAsPrefix = numberOfXs + 1 === numbersOnly.length;

		// 1 has been included in the str, but is not in the desired format
		if (hasOneAsPrefix) {
			numbersOnly.shift();
		}

		if (numberOfXs === numbersOnly.length || hasOneAsPrefix) {
			numbersOnly.forEach(function (number) {
				format = format.replace('x', number);
			});
		} else {
			console.error('Incorrect Format. Double Check your values.');
			return null;
		}

		return format;
	}

	var _formatters = {
		currency: formatCurrency,
		phoneNumber: formatPhoneNumber
	};

	function format(key, val, strFormat) {
		return _formatters[key](val, strFormat);
	}

	return format;
}());
