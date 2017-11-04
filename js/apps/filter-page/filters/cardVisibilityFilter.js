((app) => {
	const cardVisibilityFilter = (tagParsingService) => {
		return (cards, activeFilters) => {
			let filtered = [];

			angular.forEach(cards, (card) => {
				let matches = 0;

				angular.forEach(card.attributes, (attribute) => {
					if (activeFilters.indexOf(tagParsingService.extractTagName(attribute)) !== -1) {
						matches += 1;
					}
				});

				if (matches === activeFilters.length) {
					filtered.push(card);
				}
			});

			return filtered;
		};
	};

	cardVisibilityFilter.$inject = ['tagParsingService'];

	app.filter('cardVisibilityFilter', cardVisibilityFilter);
})(angular.module('filterPageApp'));
