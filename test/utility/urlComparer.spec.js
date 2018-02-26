describe('Href comparer utility', () => {
	describe('removeFilenameAndTrailingSlash', () => {
		it('should remove the filename and trailing slash from a URL with the default filename', () => {
			const url = 'https://www.bcpl.info/test/index.html';
			const expected = 'https://www.bcpl.info/test';

			const actual = bcpl.utility.urlComparer.removeFilenameAndTrailingSlash(url, bcpl.utility.urlComparer.hrefEndingTypes.fileName);

			expect(actual).toEqual(expected);
		});

		it('should remove the filename and trailing slash from a URL with a non-default filename', () => {
			const url = 'https://www.bcpl.info/test/abcdefg.html';
			const expected = 'https://www.bcpl.info/test/abcdefg.html';

			const actual = bcpl.utility.urlComparer.removeFilenameAndTrailingSlash(url, bcpl.utility.urlComparer.hrefEndingTypes.fileName);

			expect(actual).toEqual(expected);
		});

		it('should remove the trailing slash from a URL with a trailing slash', () => {
			const url = 'https://www.bcpl.info/test/';
			const expected = 'https://www.bcpl.info/test';

			const actual = bcpl.utility.urlComparer.removeFilenameAndTrailingSlash(url, bcpl.utility.urlComparer.hrefEndingTypes.slash);

			expect(actual).toEqual(expected);
		});

		it('should ignore a URL without a filename or trailing slash', () => {
			const url = 'https://www.bcpl.info/test';
			const expected = 'https://www.bcpl.info/test';

			const actual = bcpl.utility.urlComparer.removeFilenameAndTrailingSlash(url, bcpl.utility.urlComparer.hrefEndingTypes.folderName);

			expect(actual).toEqual(expected);
		});
	});

	describe('isSamePage', () => {
		it('should determine two identical URLs that end in filenames are the same', () => {
			const url1 = 'https://www.bcpl.info/test/index.html';
			const url2 = 'https://www.bcpl.info/test/index.html';

			const actual = bcpl.utility.urlComparer.isSamePage(url1, url2);

			expect(actual).toBe(true);
		});

		it('should determine two identical URLs that end in slashes are the same', () => {
			const url1 = 'https://www.bcpl.info/test/';
			const url2 = 'https://www.bcpl.info/test/';

			const actual = bcpl.utility.urlComparer.isSamePage(url1, url2);

			expect(actual).toBe(true);
		});

		it('should determine two identical URLs that end in folders are the same', () => {
			const url1 = 'https://www.bcpl.info/test';
			const url2 = 'https://www.bcpl.info/test';

			const actual = bcpl.utility.urlComparer.isSamePage(url1, url2);

			expect(actual).toBe(true);
		});
	});
});
