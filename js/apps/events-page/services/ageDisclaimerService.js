((app) => {
	const ageDisclaimerService = ($window, CONSTANTS) => {
		const shouldShowDisclaimer = (eventItem) => {
			const ageGroupsForDisclaimer = CONSTANTS.ageDisclaimer.ageGroupIds;
			const ageGroupsFromEvent = eventItem.AgeGroups;

			const intersection = $window._.intersection(ageGroupsForDisclaimer, ageGroupsFromEvent);

			return intersection && intersection.length > 0;
		};

		return {
			shouldShowDisclaimer
		};
	};

	ageDisclaimerService.$inject = ['$window', 'events.CONSTANTS'];

	app.factory('ageDisclaimerService', ageDisclaimerService);
})(angular.module('eventsPageApp'));
