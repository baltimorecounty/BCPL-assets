((app) => {
	'use strict';

	const datePickersDirective = ($timeout, $window, CONSTANTS) => {
		const datePickersLink = (scope, attr, datePickersElement) => {
			const innerScope = scope;
			const getStartDateLocaleString = () => $window.moment().format();
			const getEndDateLocaleString = () => $window.moment().add(30, 'd').format();

			innerScope.areDatesInvalid = false;

			const flatpickrBasicSettings = {
				dateFormat: 'F d, Y',
				disable: [function disable(date) {
					return $window.moment(date).isBefore(new Date(), 'day');
				}],
				onChange: function onChange() {
					$timeout(() => {
						innerScope.userStartDate = innerScope.userStartDate || getStartDateLocaleString();
						innerScope.userEndDate = innerScope.userEndDate || getEndDateLocaleString();

						$timeout(() => {
							innerScope.areDatesInvalid = isDateRangeInvalid();

							if (!innerScope.areDatesInvalid) {
								innerScope.filterByDate();
							}
						});
					});
				}
			};

			innerScope.updateEndDate = () => {
				innerScope.areDatesInvalid = isDateRangeInvalid();

				if (innerScope.areDatesInvalid) {
					innerScope.userEndDate = $window
						.moment(innerScope.userStartDate)
						.add(1, 'd')
						.format('MMMM DD, YYYY');
				}
				innerScope.filterByDate();
			};

			innerScope.openFlatpickr = (flatpickrElementId) => {
				const flatpickr = document.querySelector('#' + flatpickrElementId)._flatpickr; // eslint-disable-line no-underscore-dangle
				flatpickr.open();
			};

			const isDateRangeInvalid = () => {
				if ($window.moment(innerScope.userStartDate).isSameOrBefore(innerScope.userEndDate)) {
					return false;
				}
				return true;
			};
      
			angular.element(document).ready(() => {
				$window.flatpickr('#start-date, #end-date', flatpickrBasicSettings);
			});
		};

		const directive = {
			link: datePickersLink,
			restrict: 'E',
			templateUrl: CONSTANTS.templateUrls.datePickersTemplate,
			scope: {
				userStartDate: '=startDateModel',
				userEndDate: '=endDateModel',
				filterByDate: '=filterByDate'
			}
		};

		return directive;
	};

	datePickersDirective.$inject = ['$timeout', '$window', 'events.CONSTANTS'];

	app.directive('datePickers', datePickersDirective);
})(angular.module('eventsPageApp'));
