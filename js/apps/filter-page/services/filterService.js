((app) => {
	const filterService = () => {
		const getAllTagInfo = (dataWithTags) => {
			let tags = [];

			angular.forEach(dataWithTags, (dataItem) => {
				tags = tags.concat(dataItem.Tags);
			});

			return tags;
		};

		const getFamilies = (tagInfoArr) => {
			return _.uniq(_.pluck(tagInfoArr, 'Name'), name => name);
		};

		const getFamilyTags = (familyName, tagInfoArr) => {
			const familyTagInfo = _.where(tagInfoArr, { Name: familyName });
			return _.uniq(_.sortBy(_.pluck(familyTagInfo, 'Tag'), tag => tag), tag => tag);
		};

		const getFamilyType = (familyName, tagInfoArr) => {
			return _.findWhere(tagInfoArr, { Name: familyName }).Type;
		};

		const build = (cardData) => {
			let filterData = [];

			const tagInfoArr = getAllTagInfo(cardData);
			const families = getFamilies(tagInfoArr);

			angular.forEach(families, (family) => {
				filterData.push({
					name: family,
					tags: getFamilyTags(family, tagInfoArr),
					type: getFamilyType(family, tagInfoArr)
				});
			});

			return filterData;
		};

		return {
			build
		};
	};

	app.factory('filterService', filterService);

})(angular.module('filterPageApp'));
