((app) => {
	'use strict';

	const filterDirective = () => {
		const filterLink = function filterLink($scope, filterElement) {
			const $filterElement = angular.element(filterElement);
			const $input = $filterElement.find('input');
			const inputType = $scope.filterType.trim().toLowerCase() === 'many' ? 'checkbox' : 'radio';
			$input.prop('type', inputType);

			if (inputType === 'radio') {
				$input.prop('name', $scope.familyName);
			}

			$scope.toggleFilter = (activeFilter) => {
				const isFilterChecked = $filterElement.has(':checked').length > 0;

				if (inputType === 'checkbox') {
					$filterElement.find('label').toggleClass('active', isFilterChecked);
					$scope.filterHandler(activeFilter);
				} else {
					const $filterFamilyWrapper = $filterElement.closest('.filter-family');
					const $filterLabels = $filterFamilyWrapper.find('label');
					const $targetLabel = $filterElement.find('label');
					const $otherRadioLabels = $filterLabels.not($targetLabel);

					$otherRadioLabels.each((index, otherRadioLabelElement) => {
						const $otherRadioLabel = angular.element(otherRadioLabelElement);
						if ($otherRadioLabel.is('.active')) {
							$scope.filterHandler($otherRadioLabel.text().trim());
						}
					});

					$targetLabel.toggleClass('active', isFilterChecked);
					$scope.filterHandler(activeFilter);
				}
			};
		};

		const directive = {
			scope: {
				tag: '=',
				activeFilters: '=',
				filterHandler: '=',
				filterType: '=',
				familyName: '='
			},
			restrict: 'E',
			templateUrl: '/dist/js/apps/filter-page/templates/filter.html',
			link: filterLink
		};

		return directive;
	};

	filterDirective.$inject = [];

	app.directive('filter', filterDirective);
})(angular.module('filterPageApp'));
