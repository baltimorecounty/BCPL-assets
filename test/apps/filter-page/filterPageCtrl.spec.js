describe('filterPageCtrl', () => {
	const fakeWindow = {
		location: {
			pathname: 'locations'
		}
	};

	beforeEach(angular.mock.module('filterPageApp', ($provide) => {
		$provide.value('$window', fakeWindow);
	}));

	let $controller;

	describe('setActiveFilters', () => {
		let controller;
		let $scope;
		let mockTagFamily;

		beforeEach(angular.mock.inject(function injectController(_$controller_) {
			$controller = _$controller_;
			controller = $controller('FilterPageCtrl', { $scope: $scope });
			mockTagFamily = {
				name: 'test',
				type: 'many',
				tags: ['test1', 'test2', 'test3', 'test4']
			};
		}));

		it('should add a filter to an empty list', () => {
			controller.activeFilters = [];
			controller.setActiveFilters('test', mockTagFamily);

			expect(controller.activeFilters[0]).toBe('test');
		});

		it('should remove an added filter from an empty list', () => {
			controller.activeFilters = [];
			controller.setActiveFilters('test', mockTagFamily);
			controller.setActiveFilters('test', mockTagFamily);

			expect(controller.activeFilters.length).toBe(0);
		});

		it('should remove an added filter from a populated list', () => {
			controller.activeFilters = [];
			controller.setActiveFilters('test1', mockTagFamily);
			controller.setActiveFilters('test2', mockTagFamily);
			controller.setActiveFilters('test3', mockTagFamily);

			controller.setActiveFilters('test2', mockTagFamily);

			expect(controller.activeFilters).toEqual(['test1', 'test3']);
		});

		describe('getFiltersFromString', () => {
			it('should return a single filter if only one is listed', () => {
				const filterStr = 'Adult';
				const actual = controller.getFiltersFromString(filterStr);
				
				expect([filterStr]).toEqual(actual);
			});
			it('should return an array of filter if the string is comma seperated', () => {
				const filterStr = 'Adult,Kids,All Ages';
				const actual = controller.getFiltersFromString(filterStr);
				const expected = ['Adult', 'Kids', 'All Ages'];
				
				expect(expected).toEqual(actual);
			});

			it('should return an empty array if the filter doesn\'t exist', () => {
				const filterStr = null;
				const actual = controller.getFiltersFromString(filterStr);
				
				expect([]).toEqual(actual);
			});
		});
		describe('formatKeyName', () => {
			it('should return an empty string if the does not exist', () => {
				const actual = controller.formatKeyName(null);
				
				expect("").toEqual(actual);
			});

			it('should replace a "-" with a space', () => {
				const key = 'Library-Card';
				const actual = controller.formatKeyName(key);
				
				expect('Library Card').toEqual(actual);
			});

			it('should replace multiple "-" with multiple spaces', () => {
				const key = 'My-Library-Card';
				const actual = controller.formatKeyName(key);
				
				expect('My Library Card').toEqual(actual);
			});

			it('should not change the key if there is no "-" in the string', () => {
				const key = 'LibraryCard';
				const actual = controller.formatKeyName(key);
				
				expect(key).toEqual(actual);
			});
		});
		describe('getFilterFamily', () => {
			let mockFilters = [
				{
					name: 'test',
					tags: ['tag1', 'tag2'],
					type: "Many",
					filterId: 'test'
				},
				{
					name: 'test1',
					tags: ['tag3', 'tag4'],
					type: "Many",
					filterId: 'test1'
				}
			];

			beforeEach((done) => {
				controller.filters = mockFilters;
				done();
			})

			it(`should return null if the key is null`, () => {
				const actual = controller.getFilterFamily(null);
				
				expect(null).toEqual(actual);
			});

			it(`should return null if there is no match`, () => {
				const actual = controller.getFilterFamily("test3");
				
				expect(null).toEqual(actual);
			});

			it(`should return the first object form the mock filters: ${mockFilters[0].name}`, () => {
				const key = 'test';
				const actual = controller.getFilterFamily(key);
				const expected = mockFilters[0];
				
				expect(expected).toEqual(actual);
			});

			it(`should return the second object form the mock filters: ${mockFilters[1].name}`, () => {
				const key = 'test1';
				const actual = controller.getFilterFamily(key);
				const expected = mockFilters[1];
				
				expect(expected).toEqual(actual);
			});
		});
	});

	describe('filterDataItems', () => {
		let controller;
		let $scope;
		let testDataItem;

		beforeAll(() => {
			testDataItem = {
				Tags: [{
					Name: 'none',
					Tag: 'test1',
					Type: 'Many'
				}, {
					Name: 'none',
					Tag: 'test2',
					Type: 'Many'
				}, {
					Name: 'none',
					Tag: 'test3',
					Type: 'Many'
				}]
			};
		});

		beforeEach(angular.mock.inject(function injectController(_$controller_) {
			$controller = _$controller_;
			controller = $controller('FilterPageCtrl', { $scope: $scope });
		}));

		it('should return true when an item matches a single filter', () => {			
			controller.activeFilters = ['test1'];

			expect(controller.filterDataItems(testDataItem)).toBe(true);
		});

		it('should return true when a data item exactly matches all filters', () => {
			controller.activeFilters = ['test1', 'test2', 'test3'];

			expect(controller.filterDataItems(testDataItem)).toBe(true);
		});

		it('should return true when a data item matches all filters', () => {
			controller.activeFilters = ['test1', 'test2'];

			expect(controller.filterDataItems(testDataItem)).toBe(true);
		});

		it('should return false an item does not match a single filter', () => {
			controller.activeFilters = ['test4'];

			expect(controller.filterDataItems(testDataItem)).toBe(false);
		});

		it('should return false when a data item does not match all filters', () => {
			controller.activeFilters = ['test1', 'test4'];

			expect(controller.filterDataItems(testDataItem)).toBe(false);
		});
	});
	
});
