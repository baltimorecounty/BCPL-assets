((app) => {
	const cardVisibilityFilter = () => {
		return (cards, activeFilters) => {
			let filtered = [];

			angular.forEach(cards, (card) => {
				let matches = 0;

				angular.forEach(card.Tags, (tag) => {
					if (activeFilters.indexOf(tag.Tag) !== -1) {
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

	cardVisibilityFilter.$inject = [];

	app.filter('cardVisibilityFilter', cardVisibilityFilter);
})(angular.module('filterPageApp'));
