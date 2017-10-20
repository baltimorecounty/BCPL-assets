describe('Branch map', () => {
	describe('getAddressForDirections', () => {
		it('should build the branch address for maps consumption from a well-formed branch', () => {
			const testBranch = {
				address: '123 test street',
				city: 'testville',
				zip: '01234'
			};

			const experimental = bcpl.pageSpecific.branchMap.getAddressForDirections(testBranch);

			expect(experimental).toBe('123+test+street+testville+MD+01234');
		});		
	});
	
	describe('clearMarkers', () => {
		it('should clear all markers from the map', () => {
			bcpl.pageSpecific.branchMap.clearMarkers();

			expect(bcpl.pageSpecific.branchMap.markers.length).toBe(0);
		});
	});

	describe('updateMapMarkers', () => {
		it('should not throw an error when filter data is undefined', () => {
			// updateMapMarkers = (filterChangedEvent, filterData)
			const testEvent = {};
			const testFilterData = undefined;

			expect(() => {
				bcpl.pageSpecific.branchMap.updateMapMarkers(testEvent, testFilterData);
			}).not.toThrow();
		});
	});
});
