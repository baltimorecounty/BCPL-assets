describe('tagParsingService', () => {
	beforeEach(angular.mock.module('filterPageApp'));

	describe('parseTags', () => {
		it('should return an empty array when given a string', inject((tagParsingService) => {
			expect(tagParsingService.parseTags('test')).toEqual([]);
		}));

		it('should return an empty array when given a number', inject((tagParsingService) => {
			expect(tagParsingService.parseTags(1)).toEqual([]);
		}));

		it('should return an empty array when given undefined', inject((tagParsingService) => {
			expect(tagParsingService.parseTags(undefined)).toEqual([]);
		}));

		it('should return an empty array when given null', inject((tagParsingService) => {
			expect(tagParsingService.parseTags(null)).toEqual([]);
		}));

		it('should return an array of objects when presented with non-delimited tags', inject((tagParsingService) => {
			const expected = [{
				name: 'none',
				type: 'many',
				tags: ['test1', 'test2', 'test3']
			}];

			const actual = tagParsingService.parseTags(['test1', 'test2', 'test3']);

			expect(actual).toEqual(expected);
		}));

		it('should return an array of objects when presented with name|tag delimited tags', inject((tagParsingService) => {
			const expected = [{
				name: 'type',
				type: 'many',
				tags: ['test1', 'test2', 'test3']
			}];

			const actual = tagParsingService.parseTags(['type|test1', 'type|test2', 'type|test3']);

			expect(actual).toEqual(expected);
		}));

		it('should return an array of objects when presented with name|tag|type delimited tags', inject((tagParsingService) => {
			const expected = [{
				name: 'type',
				type: 'many',
				tags: ['test1', 'test2', 'test3']
			}];

			const actual = tagParsingService.parseTags(['type|test1|many', 'type|test2|many', 'type|test3|many']);

			expect(actual).toEqual(expected);
		}));

		it('should return an array of objects when presented with name|tag|type delimited tags with different names', inject((tagParsingService) => {
			const expected = [{
				name: 'type1',
				type: 'many',
				tags: ['test1', 'test2']
			}, {
				name: 'type2',
				type: 'many',
				tags: ['test3', 'test4']
			}];

			const actual = tagParsingService.parseTags(['type1|test1|many', 'type1|test2|many', 'type2|test3|many', 'type2|test4|many']);

			expect(actual).toEqual(expected);
		}));

		it('should return an aarray of objects sorted in the supplied order of tag families', inject((tagParsingService) => {
			const expected = [{
				name: 'type4',
				type: 'many',
				tags: ['test1', 'test2']
			}, {
				name: 'type3',
				type: 'many',
				tags: ['test3', 'test4']
			}, {
				name: 'type1',
				type: 'many',
				tags: ['test5', 'test6']
			}, {
				name: 'type2',
				type: 'many',
				tags: ['test7', 'test8']
			}];

			const actual = tagParsingService.parseTags([
				'type4|test1|many',
				'type4|test2|many',
				'type3|test3|many',
				'type3|test4|many',
				'type1|test5|many',
				'type1|test6|many',
				'type2|test7|many',
				'type2|test8|many'
			]);

			expect(actual).toEqual(expected);
		}));
	});

	describe('extractTagName', () => {
		it('should return a single tag when given a non-extractible string tag', inject((tagParsingService) => {
			const expected = 'test';

			const actual = tagParsingService.extractTagName('test');

			expect(actual).toEqual(expected);
		}));

		it('should return the tag name when given a wellformed tag', inject((tagParsingService) => {
			const expected = 'test';

			const actual = tagParsingService.extractTagName('type|test|many');

			expect(actual).toEqual(expected);
		}));

		it('should return an empty string when given undefined', inject((tagParsingService) => {
			const expected = '';

			const actual = tagParsingService.extractTagName(undefined);

			expect(actual).toEqual(expected);
		}));

		it('should return an empty string when given a number', inject((tagParsingService) => {
			const expected = '';

			const actual = tagParsingService.extractTagName(1);

			expect(actual).toEqual(expected);
		}));
	});
});
