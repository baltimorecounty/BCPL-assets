const constants = {
    rootUrl: 'https://www.bcpl.info/youth/index.html',
    blogUrl: 'https://www.bcpl.info/blog',
    selectors: {
        blogEntry: '.card--blog .card-heading',
        breadcrumbs: '.breadcrumbs-wrapper .breadcrumb',
        collapsibleBreadCrumbContainer: '.hidden-breadcrumb-container',
        hiddenBreadCrumbList: '.hidden-breadcrumb-list'
    }
};

describe('Breadcrumbs', () => {
    beforeEach(() => {
        cy.get(constants.selectors.breadcrumbs).as('breadCrumbs');
    });

    describe('default', () => {
        before(() => {
            cy.visit(constants.rootUrl);
        });

        it('should show two breadcrumbs', () => {
            cy
                .get('@breadCrumbs')
                .its('length')
                .should('eq', 2);
        });

        it('should the first breadcrumb as a link "Home"', () => {
            cy
                .get('@breadCrumbs')
                .first()
                .contains('Home');
        });

        it('should the first breadcrumb as a link "Youth"', () => {
            cy
                .get('@breadCrumbs')
                .last()
                .contains('Youth');
        });
    });

    describe('collapsible', () => {
        before(() => {
            cy.visit(constants.blogUrl);
            cy
                .get(constants.selectors.blogEntry)
                .first()
                .find('a')
                .click({ force: true }); // select the first blog entry
        });

        it('should show more than two breadcrumbs', () => {
            cy
                .get('@breadCrumbs')
                .its('length')
                .should('be.above', 2);
        });

        it('should show the collapsible breadcrumb container', () => {
            cy
                .get(constants.selectors.collapsibleBreadCrumbContainer)
                .should('exist');
        });

        it('should show a list of breadcrumbs when the collapsible breadcrumb container is selected', () => {
            cy.get(constants.selectors.collapsibleBreadCrumbContainer).click();

            cy
                .get(constants.selectors.hiddenBreadCrumbList)
                .should('be.visible');
        });

        it('should show at least two links in the collapsible breadcrumb list', () => {
            cy
                .get(constants.selectors.hiddenBreadCrumbList)
                .find('li')
                .its('length')
                .should('be.above', 1);

            cy
                .get(constants.selectors.hiddenBreadCrumbList)
                .should('be.visible');
        });

        it('should hide more breadcrumbs when the collapsible breadcrumb container is selected after already being expanded', () => {
            cy.get(constants.selectors.collapsibleBreadCrumbContainer).click();

            cy
                .get(constants.selectors.hiddenBreadCrumbList)
                .should('not.be.visible');
        });
    });
});
