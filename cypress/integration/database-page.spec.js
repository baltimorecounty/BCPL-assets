const constants = {
    rootUrl: 'https://www.bcpl.info/books-and-more/databases.html',
    selectors: {
        databaseListContainer: '.database-cards',
        databaseListItems: '.card:not(.ng-hide)',
        filters: '#filters',
        filterButton: '[data-toggle="collapse"]'
    }
};

describe('Database Page', () => {
    /** Helper Functions */
    const assertNumberOfResearchDatabases = () => {
        getReasearchDatabases()
            .then(researchDatabases => {
                numberOfResearchDatabases = researchDatabases.length;
                expect(numberOfResearchDatabases).to.be.greaterThan(0);
            });
    };

    const getReasearchDatabases = () => 
        cy
            .wait(500) // wait for ajax to complete, yes i know this isn't great
            .get(constants.selectors.databaseListContainer)
            .find(constants.selectors.databaseListItems);

    /** End of Helper Functions */

    let numberOfResearchDatabases = 0;

    before(() => {
        cy.visit(constants.rootUrl);
    });

    it('should display the Database Page', () => {
        // if the before passes this mean the database page is loaded
    });

    it('should contain a list of research databases', () => {
        assertNumberOfResearchDatabases();
    });

    describe('Database Filter Controls', () => {
        /** Helper Functions */
        const toggleFilter = () =>
            cy
                .get('@filterButtons')
                .first()
                .click();

        /** End of Helper Functions */

        beforeEach(() => {
            cy
                .get(constants.selectors.filters)
                .find(constants.selectors.filterButton)
                .as('filterButtons');
        });

        it('should have the subject and age filters collapsed on page load', () => {
            cy
                .get('@filterButtons')
                .should('have.attr', 'aria-expanded', 'false');
        });

        it('should expand a filter when it is selected', () => {
            toggleFilter().should('have.attr', 'aria-expanded', 'true');
        });

        it('should collapse an expanded filter when it is selected', () => {
            cy.wait(1000);

            toggleFilter().should('have.attr', 'aria-expanded', 'false');
        });
    });

    describe('Database Filters', () => {
        /** Helper Functions */
        const assertActiveFilterMatch = activeTag => {
            const isActiveFilter = activeFilters.includes(
                activeTag[0].innerText
            );
            expect(isActiveFilter).to.be.equal(true);
        };

        const assetFiltersHaveChanged = () => {
            getReasearchDatabases()
                .then(filteredDatabases => {
                    numberOfFilteredDatabases = filteredDatabases.length;
                    expect(filteredDatabases.length).to.be.below(
                        numberOfResearchDatabases
                    );
                });
        };

        const getActiveTags = () => cy.get('.tag-list').find('.active');

        const getClearButton = () =>
            cy
                .get('button')
                .contains('Clear filters');

        const getFilterButton = (familyFilterButton, targetLabelText) => 
            familyFilterButton
                .closest('.filter-family')
                .find('ul > li label')
                .contains(targetLabelText)
                .then(updateActiveFilters);

        const getFirstFilterFamilyButton = () => 
            cy
                .wait(500)
                .get('@filterButtons')
                .first();
        
        const updateActiveFilters = filterButton => {
            activeFilters.push(
                filterButton && filterButton.length
                    ? filterButton[0].innerText.trim()
                    : ''
            );
        };

        /** End of Helper Functions */

        let numberOfFilteredDatabases = 0;
        let activeFilters = [];

        beforeEach(() => {
            cy
                .get(constants.selectors.filters)
                .find(constants.selectors.filterButton)
                .as('filterButtons');
        });

        it('should filter records based on the first filter', () => {
            const filterFamilyButton = getFirstFilterFamilyButton()
                .click()
                .wait(1000);

            getFilterButton(filterFamilyButton, 'Biography')
                .click();

            assetFiltersHaveChanged();
        });

        it('should show cards with the selected filter', () => {
            getActiveTags().each(assertActiveFilterMatch);
        });

        it('should allow for multiple filters to be applied', () => {
            const filterFamilyButton = getFirstFilterFamilyButton()
                .wait(1000);

            getFilterButton(filterFamilyButton, 'History')
                .click();

            assetFiltersHaveChanged();
        });

        it('should show cards with the selected multiple filter', () => {
            getActiveTags().each(assertActiveFilterMatch);
        });

        it('should be able to remove a filter by selecting a tag', () => {
            getActiveTags()
                .first()
                .click()
                .its('length')
                .should('gt', 0);
        });

        it('should clear all filters when selecting the "clear filters" button', () => {
            getClearButton()
                .click()
                .wait(500);

            getActiveTags().should('not.exist');
        });
    });
});
