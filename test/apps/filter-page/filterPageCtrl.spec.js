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
	});
});
