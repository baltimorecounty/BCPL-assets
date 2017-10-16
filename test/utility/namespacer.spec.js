describe('namespacer', () => {
	it('creates an object based on a passed-in string', () => {
		namespacer('mytest.namespacer');

		expect(mytest.namespacer).toBeTruthy();
	});

	it('does nothing when passed an undefined value', () => {
		expect(namespacer(undefined)).toBeFalsy();
	});

	it('does nothing when passed an empty value', () => {
		expect(namespacer('')).toBeFalsy();
	});
});
