describe('eventsService', () => {
	let eventsService;

	beforeEach(() => {
		angular.mock.module('eventsPageApp', () => {});
		angular.mock.inject(function injectService(_eventsService_) {
			eventsService = _eventsService_;
		});
	});

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
});
