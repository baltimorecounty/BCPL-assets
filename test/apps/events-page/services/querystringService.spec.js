describe('querystringService', () => {
	let querystringService;

	beforeEach(() => {
		angular.mock.module('eventsPageApp', () => {});
		angular.mock.inject(function injectService(_querystringService_) {
			querystringService = _querystringService_;
		});
	});

	it('should build a querystring from a simple object', () => {
		const testObject = {
			larry: 1,
			curly: 2,
			moe: 3
		};
		const expected = 'larry=1&curly=2&moe=3&';

		const actual = querystringService.build(testObject);

		expect(actual).toEqual(expected);
	});

	it('should return an empty string from an empty object', () => {
		const testObject = {};
		const expected = '';

		const actual = querystringService.build(testObject);

		expect(actual).toEqual(expected);
	});

	it('should return an empty string from undefined', () => {
		const testObject = undefined;
		const expected = '';

		const actual = querystringService.build(testObject);

		expect(actual).toEqual(expected);
	});
});
