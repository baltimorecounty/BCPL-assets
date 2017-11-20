((app) => {
	const datePickersDirective = ($timeout, CONSTANTS) => {
		const datePickersLink = (scope, attr, datePickersElement) => {
			const innerScope = scope;

			innerScope.areDatesInvalid = false;

			const flatPickrBasicSettings = {
				dateFormat: 'F d, Y',
				disable: [function disable(date) {
					return moment(date).isBefore(new Date(), 'day');
				}],
				onChange: function onChange() {
					$timeout(() => {
						innerScope.userStartDate = innerScope.userStartDate || innerScope.userEndDate;
						innerScope.userEndDate = innerScope.userEndDate || innerScope.userStartDate;

						$timeout(() => {
							if (moment(innerScope.userStartDate).isSameOrBefore(innerScope.userEndDate)) {
								innerScope.areDatesInvalid = false;
								innerScope.filterByDate();
							} else {
								innerScope.areDatesInvalid = true;
							}
						});
					});
				}
			};

			flatpickr('#start-date, #end-date', flatPickrBasicSettings);
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

	datePickersDirective.$inject = ['$timeout', 'CONSTANTS'];

	app.directive('datePickers', datePickersDirective);
})(angular.module('eventsPageApp'));
