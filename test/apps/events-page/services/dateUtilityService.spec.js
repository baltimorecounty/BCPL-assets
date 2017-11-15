describe('dateUtilityService', () => {
	let dateUtilityService;

	beforeEach(() => {
		angular.mock.module('eventsPageApp', () => {});
		angular.mock.inject(function injectService(_dateUtilityService_) {
			dateUtilityService = _dateUtilityService_;
		});
	});

	describe('get12HourValue', () => {
		it('should return 12 when given 0', () => {
			const actual = dateUtilityService.get12HourValue(new Date('2017-11-01T0:00'));

			expect(actual).toEqual(12);
		});

		it('should return the hour when given an hour less than or equal to 12', () => {
			const actual = dateUtilityService.get12HourValue(new Date('2017-11-01T9:00'));

			expect(actual).toEqual(9);
		});

		it('should return the hour when given a number above 12', () => {
			const actual = dateUtilityService.get12HourValue(new Date('2017-11-01T15:00'));

			expect(actual).toEqual(3);
		});
	});

	describe('getAmPm', () => {
		it('should return "a.m." when given 0', () => {
			const actual = dateUtilityService.getAmPm(new Date('2017-11-01T0:00'));

			expect(actual).toEqual('a.m.');
		});

		it('should return "a.m." when given an hour below 12', () => {
			const actual = dateUtilityService.getAmPm(new Date('2017-11-01T9:00'));

			expect(actual).toEqual('a.m.');
		});

		it('should return "p.m." when given an hour greater than or equal to 12', () => {
			const actual = dateUtilityService.getAmPm(new Date('2017-11-01T15:00'));

			expect(actual).toEqual('p.m.');
		});
	});

	describe('formatSchedule', () => {
		it('should return "10:00 a.m. to 1:00 p.m." when given a timespan on 3 hours starting at 10 a.m.', () => {
			const actual = dateUtilityService.formatSchedule('2017-11-01T10:00:00', 180);

			expect(actual).toEqual('10:00 a.m. to 1:00 p.m.');
		});
	});

	describe('getMinuteString', () => {
		it('should return 00 when given 0', () => {
			const actual = dateUtilityService.getMinuteString(0);

			expect(actual).toEqual('00');
		});

		it('should return 07 when given 7', () => {
			const actual = dateUtilityService.getMinuteString(7);

			expect(actual).toEqual('07');
		});

		it('should return 15 when given 15', () => {
			const actual = dateUtilityService.getMinuteString(15);

			expect(actual).toEqual('15');
		});
	});

	describe('addDays', () => {
		// addDays = (dateOrString, daysToAdd)

		it('should add days to a supplied date object', () => {
			const expected = new Date('1/6/2017');

			const actual = dateUtilityService.addDays(new Date('1/1/2017'), 5);

			expect(actual).toEqual(expected);
		});

		it('should add days to a supplied date string', () => {
			const expected = new Date('1/6/2017');

			const actual = dateUtilityService.addDays('1/1/2017', 5);

			expect(actual).toEqual(expected);
		});

		it('should return "Invalid Date" when supplied an invalid date string', () => {
			const actual = dateUtilityService.addDays('', 5);

			expect(isNaN(actual)).toBe(true);
		});
	});
});
