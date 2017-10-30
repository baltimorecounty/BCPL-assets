describe('filterPageCtrl', () => {
	beforeEach(angular.mock.module('filterPageApp'));

	let $controller;

	describe('setActiveFilters', () => {
		let controller;
		let $scope;

		beforeEach(angular.mock.inject(function injectController(_$controller_) {
			$controller = _$controller_;
			controller = $controller('FilterPageCtrl', { $scope: $scope });
		}));

		it('should add a filter to an empty list', () => {
			controller.activeFilters = [];
			controller.setActiveFilters('test');

			expect(controller.activeFilters[0]).toBe('test');
		});

		it('should remove an added filter from an empty list', () => {
			controller.activeFilters = [];
			controller.setActiveFilters('test');
			controller.setActiveFilters('test');

			expect(controller.activeFilters.length).toBe(0);
		});

		it('should remove an added filter from a populated list', () => {
			controller.activeFilters = [];
			controller.setActiveFilters('test1');
			controller.setActiveFilters('test2');
			controller.setActiveFilters('test3');

			controller.setActiveFilters('test2');

			expect(controller.activeFilters).toEqual(['test1', 'test3']);
		});
	});

	describe('filterDataItems', () => {
		let controller;
		let $scope;

		beforeEach(angular.mock.inject(function injectController(_$controller_) {
			$controller = _$controller_;
			controller = $controller('FilterPageCtrl', { $scope: $scope });
		}));

		it('should return true when an item matches a single filter', () => {
			const testDataItem = {
				attributes: ['test']
			};
			controller.activeFilters = ['test'];

			expect(controller.filterDataItems(testDataItem)).toBe(true);
		});

		it('should return true when a data item exactly matches all filters', () => {
			const testDataItem = {
				attributes: ['test1', 'test2', 'test3']
			};
			controller.activeFilters = ['test1', 'test2', 'test3'];

			expect(controller.filterDataItems(testDataItem)).toBe(true);
		});

		it('should return true when a data item matches all filters', () => {
			const testDataItem = {
				attributes: ['test1', 'test2', 'test3']
			};
			controller.activeFilters = ['test1', 'test2'];

			expect(controller.filterDataItems(testDataItem)).toBe(true);
		});

		it('should return false an item does not match a single filter', () => {
			const testDataItem = {
				attributes: ['test1']
			};
			controller.activeFilters = ['test2'];

			expect(controller.filterDataItems(testDataItem)).toBe(false);
		});

		it('should return false when a data item does not match all filters', () => {
			const testDataItem = {
				attributes: ['test1', 'test2', 'test3']
			};
			controller.activeFilters = ['test1', 'test4'];

			expect(controller.filterDataItems(testDataItem)).toBe(false);
		});
	});
});
