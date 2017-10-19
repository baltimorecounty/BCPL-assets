describe('Branch map', () => {
	it('should build the branch address for maps consumption from a well-formed branch', () => {
		const testBranch = {
			address: '123 test street',
			city: 'testville',
			zip: '01234'
		};

		const experimental = bcpl.pageSpecific.branchMap.getAddressForDirections(testBranch);

		expect(experimental).toBe('123+test+street+testville+MD+01234');
	});
	it('should build the branch address for maps consumption from a badly-formed branch', () => {});
	it('should build the branch address for maps consumption from a branch missing information', () => {});
});
