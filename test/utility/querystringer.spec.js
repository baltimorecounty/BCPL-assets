describe('querystringer', () => {
	let sampleWindow;

	beforeEach(() => {
		sampleWindow = {
			location: {
				search: '?testVar1=1&testVar2=2&testVar3=3'
			}
		};
	});

	it('should return a dictionary based on the first value of the queryString', () => {
		const actual = bcpl.utility.querystringer.getAsDictionary(sampleWindow);

		expect(actual.testvar1).toBe('1');
	});

	it('should return a dictionary based on the first value of the queryString', () => {
		const actual = bcpl.utility.querystringer.getAsDictionary(sampleWindow);

		expect(actual.testvar2).toBe('2');
	});

	it('should return a dictionary based on the first value of the queryString', () => {
		const actual = bcpl.utility.querystringer.getAsDictionary(sampleWindow);

		expect(actual.testvar3).toBe('3');
	});
});
