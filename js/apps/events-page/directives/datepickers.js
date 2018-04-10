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
							if ($window.moment(innerScope.userStartDate).isSameOrBefore(innerScope.userEndDate)) {
								innerScope.areDatesInvalid = false;
								innerScope.filterByDate();
							} else {
								innerScope.areDatesInvalid = true;
							}
						});
					});
				}
			};

			innerScope.openFlatpickr = (flatpickrElementId) => {
				const flatpickr = document.querySelector('#' + flatpickrElementId)._flatpickr; // eslint-disable-line no-underscore-dangle
				flatpickr.open();
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
