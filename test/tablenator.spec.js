
/* eslint-disable no-undef, no-underscore-dangle */

jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('Tablenator', () => {
	let $testTable;

	beforeEach((done) => {
		loadFixtures('tablenator.fixture.html');

		$testTable = $('#test-table');

		done();
	});

	describe('buildTwoColumnTables', () => {
		it('builds two-column tables from headings and data rows', () => {
			const $headings = $testTable.find('th');
			const $dataRows = $testTable.find('tr').not($headings.closest('tr'));
			const expectedTableCount = 3;

			const actual = bcpl.tablenator.buildTwoColumnTables($headings, $dataRows);

			expect(actual.length).toBe(expectedTableCount);
		});

		it('handles undefined $headings', () => {
			const $headings = undefined;
			const $dataRows = $testTable.find('tr').not($testTable.find('tr').eq(0));
			const expectedTableCount = 0;

			const actual = bcpl.tablenator.buildTwoColumnTables($headings, $dataRows);

			expect(actual.length).toBe(expectedTableCount);
		});

		it('handles undefined $dataRows', () => {
			const $headings = $testTable.find('th');
			const $dataRows = undefined;
			const expectedTableCount = 0;

			const actual = bcpl.tablenator.buildTwoColumnTables($headings, $dataRows);

			expect(actual.length).toBe(expectedTableCount);
		});
	});

	describe('createMobileTables', () => {
		it('should return a table for each column', () => {
			const expected = $testTable.find('th').length;
			bcpl.tablenator.init('#test-table', 9999); // 9999 to force the reformat

			const actual = $('.tablenator-responsive-table').length;

			expect(actual).toBe(expected);
		});

		it('should hide the original table from the page', () => {
			const expected = false;
			bcpl.tablenator.init('#test-table', 9999); // 9999 to force the reformat

			const actual = $('#test-table').is(':visible');

			expect(actual).toBe(expected);
		});
	});

	describe('init', () => {
		it('should do nothing when "tableSelector" is undefined', () => {
			const expected = $._data(window, 'events').resize.length;
			bcpl.tablenator.init(undefined, 9999); // 9999 to force the reformat

			const actual = $._data(window, 'events').resize.length;

			expect(actual).toBe(expected);
		});

		it('should do nothing when "screenBreakpoint" is undefined', () => {
			const expected = $._data(window, 'events').resize.length;
			bcpl.tablenator.init('#test-table', undefined); // 9999 to force the reformat

			const actual = $._data(window, 'events').resize.length;

			expect(actual).toBe(expected);
		});

		it('should attach the resize handler', () => {
			const expected = $._data(window, 'events').resize.length + 1;
			bcpl.tablenator.init('#test-table', 9999); // 9999 to force the reformat

			const actual = $._data(window, 'events').resize.length;

			expect(actual).toBe(expected);
		});
	});
});
