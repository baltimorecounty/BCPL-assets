/* eslint-disable no-undef */

describe('ageDisclaimerService', () => {
	let ageDisclaimerService;

	beforeEach(() => {
		angular.mock.module('eventsPageApp', () => {});

		angular.mock.inject(function injectService(_ageDisclaimerService_) {
			ageDisclaimerService = _ageDisclaimerService_;
		});
	});

	describe('shouldShowDisclaimer', () => {
		it('should return true if the age IDs of the event match any of the age IDs from constants', () => {
			const mockEvent = {
				AgeGroups: [12, 0, 0]
			};

			const actual = ageDisclaimerService.shouldShowDisclaimer(mockEvent);

			expect(actual).toBe(true);
		});

		it('should return true if the multiple age IDs of the event match any of the age IDs from constants', () => {
			const mockEvent = {
				AgeGroups: [12, 13, 0]
			};

			const actual = ageDisclaimerService.shouldShowDisclaimer(mockEvent);

			expect(actual).toBe(true);
		});

		it('should return false if the age IDs of the event do not match any of the age IDs from constants', () => {
			const mockEvent = {
				AgeGroups: [99, 0, 0]
			};

			const actual = ageDisclaimerService.shouldShowDisclaimer(mockEvent);

			expect(actual).toBe(false);
		});
	});
});
