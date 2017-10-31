((app) => {
	'use strict';

	const tagParsingService = () => {
		const tagPartIndexes = {
			name: 0,
			tag: 1,
			type: 2
		};

		const findFamily = (tagFamilies, familyName) => {
			const matchedFamilies = tagFamilies.filter((tagFamily) => {
				return tagFamily.name === familyName;
			});

			return matchedFamilies.length === 1 ? matchedFamilies[0] : undefined;
		};

		const createFamily = (familyName, tag, type) => {
			const newFamily = {
				name: familyName,
				type: type,
				tags: [tag]
			};

			return newFamily;
		};

		const parseTags = (tagList) => {
			if (!Array.isArray(tagList)) return [];

			let tagFamilies = [];

			tagList.forEach((tag) => {
				const tagParts = tag.split('|');

				if (tagParts.length === 1) {
					tagParts.unshift('none'); // Add the tag family
				}

				if (tagParts.length === 2) {
					tagParts.push('many'); // Add the tag type
				}

				const foundFamily = findFamily(tagFamilies, tagParts[tagPartIndexes.name]);

				if (foundFamily) {
					foundFamily.tags.push(tagParts[tagPartIndexes.tag]);
					foundFamily.type = tagParts[tagPartIndexes.type];
				} else {
					const newFamily = createFamily(
						tagParts[tagPartIndexes.name],
						tagParts[tagPartIndexes.tag],
						tagParts[tagPartIndexes.type]
					);

					tagFamilies.push(newFamily);
				}
			});

			return tagFamilies;
		};

		return {
			parseTags
		};
	};

	app.factory('tagParsingService', tagParsingService);
})(angular.module('filterPageApp'));
