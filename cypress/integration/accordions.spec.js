const constants = {
    rootUrl: 'https://www.bcpl.info/about-us/policies.html',
    anchorUrl:
        'https://bcpl.info/about-us/policies.html#accessibility-statement',
    attrs: {
        expanded: 'aria-expanded'
    },
    cssClasses: {
        accordionCollapsedArrow: 'fa-chevron-right',
        accordionExpandedArrow: 'fa-chevron-down'
    },
    selectors: {
        accordionContainer: '.content-accordion',
        accordionExpanded: '[aria-expanded="true"]',
        accordionPanel: '.panel',
        accessabilitySection: '#WebsiteGeneralUserTermsandConditions-panel-4'
    }
};

describe('Accordion Component', () => {
    const getFirstAccordionToggleBtn = () =>
        cy
            .get('@firstAccordion')
            .find('a')
            .first();

    const toggleFirstAccordion = () =>
        getFirstAccordionToggleBtn()
            .click()
            .wait(500);

    before(() => {
        cy.visit(constants.rootUrl);
    });

    beforeEach(() => {
        cy.get(constants.selectors.accordionContainer).as('accordions');
        cy
            .get('@accordions')
            .find(constants.selectors.accordionPanel)
            .first()
            .as('firstAccordion');
    });

    it('should be at least one accordion on the page', () => {
        cy.get('@firstAccordion').should('exist');
    });

    it('should expand when the accordion header is selected', () => {
        toggleFirstAccordion()
            .closest(constants.selectors.accordionPanel)
            .find(constants.selectors.accordionExpanded)
            .should('exist');
    });

    it('should show a down arrow icon when the accordion is expanded', () => {
        getFirstAccordionToggleBtn()
            .find('i')
            .should('have.class', constants.cssClasses.accordionExpandedArrow);
    });

    it('should collapse an expanded accordion if its header is selected', () => {
        toggleFirstAccordion()
            .closest(constants.selectors.accordionPanel)
            .find(constants.selectors.accordionExpanded)
            .should('not.exist');
    });

    it('should show a right arrow icon when the accordion is collapsed', () => {
        getFirstAccordionToggleBtn()
            .find('i')
            .should('have.class', constants.cssClasses.accordionCollapsedArrow);
    });
});

describe('Accordion Anchors', () => {
    before(() => {
        cy.visit(constants.anchorUrl);
    });

    it('should expand the accessability section', () => {
        cy
            .get(constants.selectors.accessabilitySection)
            .should('have.attr', constants.attrs.expanded, 'true');
    });

    it('should scroll to the accessability section', () => {
        cy.wait(1000); // give the test some time to get down the page

        cy.document().then(doc => {
            const docPosition = doc.documentElement.scrollTop;

            expect(docPosition).to.be.above(500); // This is just arbitray since I wasn't able to get the anchors offset correctly
        });
    });
});
