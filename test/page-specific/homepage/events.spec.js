describe('Homepage Events', () => {
	const ns = bcpl.pageSpecific.homepage.featuredEvents;

	describe('processEvent', () => {
		const mockEvent = {
			EventStart: '2017-12-26T02:34:00',
			RegistrationTypeCodeEnum: 0
		};

		it('should add an eventMonth to the event object', () => {
			const actualEvent = ns.processEvent(mockEvent);
			const expected = 'Dec';

			expect(expected).toBe(actualEvent.eventMonth);
		});

		it('should add an eventDate to the event object', () => {
			const actualEvent = ns.processEvent(mockEvent);
			const expected = '26';

			expect(expected).toBe(actualEvent.eventDate);
		});

		it('should add an eventTime to the event object', () => {
			const actualEvent = ns.processEvent(mockEvent);
			const expected = '2:34 a.m.';

			expect(expected).toBe(actualEvent.eventTime);
		});

		it('should add an requiresRegistration to the event object', () => {
			const actualEvent = ns.processEvent(mockEvent);
			const expected = false;

			expect(expected).toBe(actualEvent.requiresRegistration);
		});
	});

	describe('formatTime', () => {
		it('should turn "12:00 pm" into "12 p.m."', () => {
			const actual = ns.formatTime('12:00 pm');
			const expected = '12 p.m.';

			expect(expected).toBe(actual);
		});

		it('should turn "12:30 pm" into "12:30 p.m."', () => {
			const actual = ns.formatTime('12:30 pm');
			const expected = '12:30 p.m.';

			expect(expected).toBe(actual);
		});
	});
});
