const constants = {
    pagesToTest: [
        'https://www.bcpl.info',
        'https://www.bcpl.info/youth/kids.html'
    ],
    selectors: {
        searchButton: '#activate-search-button',
        searchInputContainer: '#search-box',
        activeSearchTab:
            '.search-control-container:visible .search-button.active',
        searchInput: '#site-search-input',
        searchEventsTab: '.search-button-events',
        searchWebsiteTab: '.search-button-website'
    }
};

constants.pagesToTest.forEach(page => {
    describe(`Search - ${page}`, () => {

        const search = (searchTerm) => 
            cy
                .get(constants.selectors.searchInput)
                .type(searchTerm)
                .closest('.site-search-input-container')
                .find('.fa-search')
                .click();

        const toggleSearch = () =>
            cy.get(constants.selectors.searchButton).click();

        const assertActiveTab = (tabText) => 
            cy
                .get(constants.selectors.searchInputContainer)
                .find(constants.selectors.activeSearchTab)
                .contains(tabText);

        const assertLocationChanged = () => {
            cy
                .location()
                .its('href')
                .should('not.eq', constants.rootUrl);
        };

        before(() => {
            cy.visit(page);
        });

        it('should load the page without error', () => {
            // if cy.visit succeeds in the before call above, this test should pass
        });

        it('should display the search input box, when the search button is selected', () => {
            toggleSearch();

            cy
                .get(constants.selectors.searchInputContainer)
                .should('have.class', 'active')
                .should('be.visible', true);
        });

        it('should default to the catalog search', () => {
            assertActiveTab('Catalog');
        });

        it('should collapse the search input box is expanded, and the search button is selected', () => {
            toggleSearch();

            cy
                .get(constants.selectors.searchInputContainer)
                .should('not.have.class', 'active')
                .should('not.be.visible', true);
        });

        describe('Catalog Search', () => {
            before(() => {
                cy.visit(page);
            });

            // TODO: This test works, but takes forever
            // it('should search the bcpl catalog', () => {
            //     toggleSearch();

            //     cy
            //         .get(constants.selectors.searchInput)
            //         .type('Harry Potter')
            //         .closest('.site-search-input-container')
            //         .find('.fa-search')
            //         .click();

            //     assertLocationChanged();
            // });
        });

        describe('Events Search', () => {
            before(() => {
                cy.visit(page);
            });

            it('should change tabs to the events tab', () => {
                toggleSearch();

                cy.get(constants.selectors.searchEventsTab).click();

                assertActiveTab('Events');
            });

            it('should search the events database', () => {
                search("Story Time");

                assertLocationChanged();
            });

        });

        describe('Website Search', () => {
            before(() => {
                cy.visit(page);
            });

            it('should change tabs to the events tab', () => {
                toggleSearch();

                cy.get(constants.selectors.searchWebsiteTab).click();

                assertActiveTab('Website');
            });

            it('should search the website', () => {
                search("Library Hours");

                assertLocationChanged();
            });
        });
    });
});
