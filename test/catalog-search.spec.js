describe('Category Search', () => {
	beforeEach((done) => {
		done();
	});

	describe('getCatalogUrl', () => {
		it('should the proper url based on searchTerm', () => {
			const mockSearchTerm = 'Harry Potter';
			const expected = `${bcpl.constants.baseCatalogUrl}${bcpl.constants.search.urls.catalog}${mockSearchTerm}`;
			const actual = bcpl.catalogSearch.getCatalogUrl(mockSearchTerm);

			expect(actual).toEqual(expected);
		});
	});
});
