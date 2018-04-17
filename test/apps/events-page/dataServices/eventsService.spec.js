/* eslint-disable no-undef */

describe('eventsService', () => {
	var eventsService;

	beforeEach(module('dataServices'));
	beforeEach(module('events'));
	beforeEach(inject(['dataServices.eventsService', function injector(_eventService) {
		eventsService = _eventService;
	}]));

	describe('isEventOnDate', () => {
		let mockEvent = {
			EventStart: '2017-11-01T09:00:00'
		};

		it('should return true when the date of an event matches the supplied date', () => {
			const actual = eventsService.isEventOnDate(mockEvent, '11/1/2017');

			expect(actual).toBe(true);
		});

		it('should return false when the date of an event does not match the supplied date', () => {
			const actual = eventsService.isEventOnDate(mockEvent, '11/2/2017');

			expect(actual).toBe(false);
		});

		it('should return false when the supplied date is undefined', () => {
			const actual = eventsService.isEventOnDate(mockEvent, undefined);

			expect(actual).toBe(false);
		});

		it('should return false when the supplied date is a number', () => {
			const actual = eventsService.isEventOnDate(mockEvent, 1);

			expect(actual).toBe(false);
		});
	});

	describe('dateSplitter', () => {
		const mockEvents = [{
			EventStart: '2017-11-01T09:00:00'
		}, {
			EventStart: '2017-11-01T09:00:00'
		}, {
			EventStart: '2017-11-02T09:00:00'
		}, {
			EventStart: '2017-11-02T09:00:00'
		}, {
			EventStart: '2017-11-03T09:00:00'
		}, {
			EventStart: '2017-11-03T09:00:00'
		}];

		it('should break events over 3 days into an array with 3 values', () => {
			const actual = eventsService.dateSplitter(mockEvents);

			expect(actual.length).toBe(3);
		});
	});

	describe('formatTime', () => {
		it('should turn "12:00 pm" into "12 p.m."', () => {
			const actual = eventsService.formatTime('12:00 pm');
			const expected = '12 p.m.';

			expect(expected).toBe(actual);
		});

		it('should turn "12:30 pm" into "12:30 p.m."', () => {
			const actual = eventsService.formatTime('12:30 pm');
			const expected = '12:30 p.m.';

			expect(expected).toBe(actual);
		});
	});

	describe('processEvent', () => {
		const mockEvent = {
			EventStart: '2017-12-26T02:34:00',
			RegistrationTypeCodeEnum: 0
		};

		it('should add an eventMonth to the event object', () => {
			const actualEvent = eventsService.processEvent(mockEvent);
			const expected = 'Dec';

			expect(expected).toBe(actualEvent.eventMonth);
		});

		it('should add an eventDate to the event object', () => {
			const actualEvent = eventsService.processEvent(mockEvent);
			const expected = '26';

			expect(expected).toBe(actualEvent.eventDate);
		});

		it('should add an eventTime to the event object', () => {
			const actualEvent = eventsService.processEvent(mockEvent);
			const expected = '2:34 a.m.';

			expect(expected).toBe(actualEvent.eventTime);
		});

		it('should add an requiresRegistration to the event object', () => {
			const actualEvent = eventsService.processEvent(mockEvent);
			const expected = false;

			expect(expected).toBe(actualEvent.requiresRegistration);
		});
	});

	describe('setStartDateForOnGoingEvent', () => {
		it('should set the StartDate to the current date if the event starts today', () => {
			const mockOnGoingEvent = {
				EventStart: null,
				OnGoingStartDate: '2018-04-15T09:00:00',
				OnGoingEndDate: '2018-04-30T09:00:00'
			};
			const currentDate = '2018-04-15T09:00:00';
			const cleanCurrentDate = '2018-04-15 09:00:00';

			const actualEvent = eventsService.setStartDateForOnGoingEvent(mockOnGoingEvent, currentDate);
			const actual = moment(actualEvent.EventStart).isSame(cleanCurrentDate, 'day');

			expect(actual).toBeTruthy();
		});

		it('should set the StartDate to the current date if the event starts yesterday', () => {
			const mockOnGoingEvent = {
				EventStart: null,
				OnGoingStartDate: '2018-04-01T09:00:00',
				OnGoingEndDate: '2018-04-30T09:00:00'
			};
			const currentDate = '2018-04-15T09:00:00';

			const actualEvent = eventsService.setStartDateForOnGoingEvent(mockOnGoingEvent, currentDate);
			const actual = moment(actualEvent.EventStart).isSame(currentDate, 'day');

			expect(actual).toBeTruthy();
		});
	});

	describe('sortSplitEventsByEventStart', ()=> {
		const mockEventGroup =  [{
			EventStart: '2018-04-01T11:00:00'
		}, {
			EventStart: '2018-04-01T10:00:00'
		}, {
			EventStart: '2018-04-01T09:00:00'
		}];

		it('should sort the event group by EventStart', () => {
			const expected = [{
				EventStart: '2018-04-01T11:00:00'
			}, {
				EventStart: '2018-04-01T10:00:00'
			}, {
				EventStart: '2018-04-01T09:00:00'
			}];

			const actual = eventsService.sortSplitEventsByEventStart(mockEventGroup);

			expect(actual[0].EventStart).toBe(expected[0].EventStart);
			expect(actual[1].EventStart).toBe(expected[1].EventStart);
			expect(actual[2].EventStart).toBe(expected[2].EventStart);
		});
	});
});
