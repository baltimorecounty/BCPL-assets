describe('emailUtilityService', () => {
	let emailUtilityService;
	const mockData = {
		EventStartDate: '01/01/2018',
		Title: 'Some Library Event'
	};
	const mockText = 'Check out this event at the Baltimore County Public Library:';
	const mockLocation = 'http://bcpl.info';

	beforeEach(() => {
		angular.mock.module('eventsPageApp', () => {});
		angular.mock.inject(function injectService(_emailUtilityService_) {
			emailUtilityService = _emailUtilityService_;
		});
	});

	describe('getEmailBody', () => {
		it(`should return "${mockText}" ${mockLocation}`, () => {
			const expected = `${mockText} ${mockLocation}`;
			const actual = emailUtilityService.getEmailBody(mockLocation);

			expect(actual).toEqual(expected);
		});
	});

	describe('getEmailSubject', () => {
		it(`should return "${mockData.EventStartDate} - ${mockData.Title}"`, () => {
			const expected = `${mockData.EventStartDate} - ${mockData.Title}`;
			const actual = emailUtilityService.getEmailSubject(mockData);

			expect(actual).toEqual(expected);
		});
	});

	describe('getShareUrl', () => {
		it(`should return "${mockData.EventStartDate} - ${mockData.Title}"`, () => {
			const mockSubject = emailUtilityService.getEmailSubject(mockData);
			const mockBody = emailUtilityService.getEmailBody(mockLocation);

			const expected = `mailto:?subject=${mockSubject}&body=${mockBody}`;
			const actual = emailUtilityService.getShareUrl(mockData, mockLocation);

			expect(actual).toEqual(expected);
		});
	});
});
