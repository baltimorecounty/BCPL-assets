describe('downloadCalendarEventService', () => {
	let downloadCalendarEventService;

	const eventTitle = 'My BCPL Event';
	const eventDescription = 'My BCPL Description';
	const eventLocation = 'Towson';

	beforeEach(() => {
		angular.mock.module('eventsPageApp', () => {});
		angular.mock.inject(function injectService(_downloadCalendarEventService_) {
			downloadCalendarEventService = _downloadCalendarEventService_;
		});
	});

	describe('getCalendarParts', () => {
		it('should create parts with a start and end date for a event that has a short duration', () => {
			const mockEventDetailResponse = {
				AllDay: false,
				Description: eventDescription,
				LocationName: eventLocation,
				Title: eventTitle,
				EventStart: '2018-01-01T18:30:00',
				OnGoingStartDate: null,
				OnGoingEndDate: null,
				EventSchedule: '6:30 to 8:30 p.m.'
			};

			const expectedCalendarParts = {
				eventTitle: `Baltimore County Public Library, ${eventLocation} Branch - ${eventTitle}`,
				eventDescription,
				eventLocation: `${eventLocation} Branch`,
				eventStartDate: '01/01/2018 6:30:00 pm',
				eventEndDate: '01/01/2018 8:30:00 pm'
			};
			const actualCalendarParts = downloadCalendarEventService.getCalendarParts(mockEventDetailResponse);

			expect(expectedCalendarParts).toEqual(actualCalendarParts);
		});

		it('should create parts for an all day event, that only spans 1 day', () => {
			const mockEventDetailResponse = {
				AllDay: true,
				Description: eventDescription,
				LocationName: eventLocation,
				Title: eventTitle,
				EventStart: '2018-01-01T00:00:00',
				OnGoingStartDate: null,
				OnGoingEndDate: null,
				EventSchedule: 'All Day'
			};

			const expectedCalendarParts = {
				eventTitle: `Baltimore County Public Library, ${eventLocation} Branch - ${eventTitle}`,
				eventDescription,
				eventLocation: `${eventLocation} Branch`,
				eventStartDate: '01/01/2018 12:00:00 am',
				eventEndDate: '01/01/2018 11:59:59 pm'
			};
			const actualCalendarParts = downloadCalendarEventService.getCalendarParts(mockEventDetailResponse);

			expect(expectedCalendarParts).toEqual(actualCalendarParts);
		});

		it('should create parts for an all day event, that last multiple days', () => {
			const mockEventDetailResponse = {
				AllDay: true,
				Description: eventDescription,
				LocationName: eventLocation,
				Title: eventTitle,
				EventStart: null,
				OnGoingStartDate: '2018-01-01T00:00:00',
				OnGoingEndDate: '2018-01-08T23:59:59',
				EventSchedule: 'All Day'
			};

			const expectedCalendarParts = {
				eventTitle: `Baltimore County Public Library, ${eventLocation} Branch - ${eventTitle}`,
				eventDescription,
				eventLocation: `${eventLocation} Branch`,
				eventStartDate: '01/01/2018 12:00:00 am',
				eventEndDate: '01/08/2018 11:59:59 pm'
			};
			const actualCalendarParts = downloadCalendarEventService.getCalendarParts(mockEventDetailResponse);

			expect(expectedCalendarParts).toEqual(actualCalendarParts);
		});
	});

	describe('getEndDate', () => {
		const startDate = '01/01/2018 01:00:00 pm';
		// AllDay, EventSchedule, EventStart, OnGoingEndDate
		it('should return the proper end date if an EventStart is provided and the end date is formated without a colon', () => {
			const mockEventDetailsResponse = {
				AllDay: false,
				EventSchedule: '1 to 3 p.m.',
				EventStart: '2018-01-01T13:00:00',
				OnGoingEndDate: null
			};

			const expected = '01/01/2018 3:00:00 pm';
			const actual = downloadCalendarEventService.getEndDate(startDate, mockEventDetailsResponse);

			expect(actual).toEqual(expected);
		});

		it('should return the proper end date if an EventStart is provided and the end date is formated with a colon', () => {
			const mockEventDetailsResponse = {
				AllDay: false,
				EventSchedule: '1 to 3:45 p.m.',
				EventStart: '2018-01-01T13:30:00',
				OnGoingEndDate: null
			};

			const expected = '01/01/2018 3:45:00 pm';
			const actual = downloadCalendarEventService.getEndDate(startDate, mockEventDetailsResponse);

			expect(actual).toEqual(expected);
		});

		it('should return a formatted end date if the event is ongoing', () => {
			const eventStartDate = '01/01/2018 00:00:00 am';
			const mockEventDetailsResponse = {
				AllDay: true,
				EventSchedule: 'All Day',
				EventStart: null,
				OnGoingEndDate: '2018-01-01T11:59:59'
			};

			const expected = '01/01/2018 11:59:59 am';
			const actual = downloadCalendarEventService.getEndDate(eventStartDate, mockEventDetailsResponse);

			expect(actual).toEqual(expected);
		});
	});

	describe('formatTime', () => {
		it('should return the value passed in if the end date contains a semi colon', () => {
			const expected = '11:45:00 am';
			const actual = downloadCalendarEventService.formatTime('11:45 am');

			expect(actual).toEqual(expected);
		});

		it('should return a formated value with a colon when passed a value without a colon ', () => {
			const expected = '11:00:00 am';
			const actual = downloadCalendarEventService.formatTime('11 am');

			expect(actual).toEqual(expected);
		});
	});

	describe('getStartDate', () => {
		it('should return a formatted start date if the EventStart exists in the response', () => {
			const mockEventDetailsResponse = {
				EventStart: '2018-01-01T11:00:00',
				OnGoingEndDate: null
			};
			const expected = '01/01/2018 11:00:00 am';
			const actual = downloadCalendarEventService.getStartDate(mockEventDetailsResponse);

			expect(actual).toEqual(expected);
		});

		it('should return a formatted start date if the event is ongoing', () => {
			const mockEventDetailsResponse = {
				EventStart: null,
				OnGoingStartDate: '2018-01-01T11:00:00'
			};
			const expected = '01/01/2018 11:00:00 am';
			const actual = downloadCalendarEventService.getStartDate(mockEventDetailsResponse);

			expect(actual).toEqual(expected);
		});
	});
});
