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
});
