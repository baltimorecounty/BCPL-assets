/* global describe it expect beforeEach */
describe('filterHelperService', () => {
	let filterHelperService;
	let location;

	beforeEach(module('sharedFilters'));
	beforeEach(inject([
		'sharedFilters.filterHelperService',
		function filterHelperServiceInjection(_filterHelperService) {
			filterHelperService = _filterHelperService;
		}
	]));

	beforeEach(inject(function locationInjection($location) {
		location = $location;
		location.search({});
	}));

	describe('clearQueryParams', () => {
		beforeEach(done => {
			location.search({
				test: 1,
				test1: 2
			});
			done();
		});

		it('should remove all existing query parameters', () => {
			filterHelperService.clearQueryParams();
			const actual = location.search();

			expect(actual).toEqual({});
		});
	});

	describe('doesKeyExist', () => {
		const mockQueryParams = {
			test: 1,
			test1: 2
		};

		beforeEach(done => {
			done();
		});

		it('should return true, if the param exists', () => {
			const doesKeyExist = filterHelperService.doesKeyExist(mockQueryParams, 'test');

			expect(doesKeyExist).toEqual(true);
		});

		it("should return false, if the param doesn't", () => {
			const doesKeyExist = filterHelperService.doesKeyExist(mockQueryParams, 'test4');

			expect(doesKeyExist).toEqual(false);
		});

		it('should return false, if the param is undefined', () => {
			const doesKeyExist = filterHelperService.doesKeyExist(mockQueryParams);

			expect(doesKeyExist).toEqual(false);
		});
	});
	describe('getFiltersFromString', () => {
		it('should return a single filter if only one is listed', () => {
			const filterStr = 'Adult';
			const actual = filterHelperService.getFiltersFromString(filterStr);

			expect([filterStr]).toEqual(actual);
		});
		it('should return an array of filter if the string is comma seperated', () => {
			const filterStr = 'Adult,Kids,All Ages';
			const actual = filterHelperService.getFiltersFromString(filterStr);
			const expected = ['Adult', 'Kids', 'All Ages'];

			expect(expected).toEqual(actual);
		});

		it("should return an empty array if the filter doesn't exist", () => {
			const filterStr = null;
			const actual = filterHelperService.getFiltersFromString(filterStr);

			expect([]).toEqual(actual);
		});
	});

	describe('getQueryParamValuesByKey', () => {
		const mockQueryParams = {
			test: '1',
			test1: '1,2'
		};

		it(`should return an array which includes ${mockQueryParams.test} when passing in a key of "test"`, () => {
			const actual = filterHelperService.getQueryParamValuesByKey(mockQueryParams, 'test');

			expect(actual).toEqual([mockQueryParams.test]);
		});

		it(`should return an array which includes ${mockQueryParams.test1} when passing in a key of "test1"`, () => {
			const actual = filterHelperService.getQueryParamValuesByKey(mockQueryParams, 'test1');

			expect(actual).toEqual(mockQueryParams.test1.split(','));
		});
		it('should return an empty array if there is bad key passed in', () => {
			const actual = filterHelperService.getQueryParamValuesByKey(mockQueryParams, 'test4');

			expect(actual).toEqual([]);
		});
		it('should return an empty array if there no key is passed in', () => {
			const actual = filterHelperService.getQueryParamValuesByKey(mockQueryParams);

			expect(actual).toEqual([]);
		});
	});
	describe('setQueryParams', () => {
		const mockQueryParam = [{
			key: 'test',
			val: 1
		}];
		it('should set query params based on mock object', () => {
			filterHelperService.setQueryParams(mockQueryParam);
			let expected = {};
			expected[mockQueryParam[0].key] = mockQueryParam[0].val;
			const actual = location.search();

			expect(actual).toEqual(expected);
		});

		it('should set query params based on mock object when query param already has other keys', () => {
			const preExistingQueryParams = {
				test19: 'test19',
				test20: 'test20'
			};
			location.search(preExistingQueryParams);

			filterHelperService.setQueryParams(mockQueryParam);

			preExistingQueryParams[mockQueryParam[0].key] = mockQueryParam[0].val;

			const actual = location.search();

			expect(actual).toEqual(preExistingQueryParams);
		});

		it('should not set anything if key doesn\'t exist', () => {
			const mockBadQueryParams = [{
				'': 'test'
			}];
			filterHelperService.setQueryParams(mockBadQueryParams);

			const actual = location.search();

			expect(actual).toEqual({});
		});
	});
	describe('updateQueryParams', () => {
		const mockFilters = [
			{
				key: 'test',
				val: '1'
			},
			{
				key: 'test',
				val: '2'
			},
			{
				key: 'test1',
				val: 'beaches'
			},
			{
				key: 'test2',
				val: 'test2'
			}
		];

		it(`should add the query param ${mockFilters[0].key}=${mockFilters[0].val} to the url when no filters are selected`, () => {
			filterHelperService.updateQueryParams([mockFilters[0]]);
			const actual = location.search();
			const expected = {};
			expected[mockFilters[0].key] = mockFilters[0].val;

			expect(expected).toEqual(actual);
		});

		it(`should remove the query param ${mockFilters[0].key}=${mockFilters[0].val} that filter is already selected`, () => {
			filterHelperService.updateQueryParams([mockFilters[0]]);
			filterHelperService.updateQueryParams([mockFilters[0]]);
			const actual = location.search();
			const expected = {};

			expect(expected).toEqual(actual);
		});

		it(`should add the query param ${mockFilters[1].val} to ${mockFilters[0].val} when both filters are added to the same key`, () => {
			filterHelperService.updateQueryParams([mockFilters[0]]);
			filterHelperService.updateQueryParams([mockFilters[1]]);
			const actual = location.search();
			const expected = {};
			expected.test = `${mockFilters[0].val},${mockFilters[1].val}`;

			expect(expected).toEqual(actual);
		});

		it(`should remove the query param ${mockFilters[0].key} when ${mockFilters[0].val} and ${mockFilters[1].val} both exist`, () => {
			filterHelperService.updateQueryParams([mockFilters[0]]);
			filterHelperService.updateQueryParams([mockFilters[2]]);
			filterHelperService.updateQueryParams([mockFilters[0]]);
			const actual = location.search();
			const expected = {};
			expected[mockFilters[2].key] = `${mockFilters[2].val}`;

			expect(expected).toEqual(actual);
		});

		it(`should add the query param ${mockFilters[2].key}=${mockFilters[2].val} when ${mockFilters[0].val} and ${mockFilters[1].val} both exist for the "test" key`, () => {
			filterHelperService.updateQueryParams([mockFilters[0]]);
			filterHelperService.updateQueryParams([mockFilters[1]]);
			filterHelperService.updateQueryParams([mockFilters[2]]);
			const actual = location.search();
			const expected = {};
			expected[mockFilters[0].key] = `${mockFilters[0].val},${mockFilters[1].val}`;
			expected[mockFilters[2].key] = `${mockFilters[2].val}`;

			expect(expected).toEqual(actual);
		});
	});
});
