const constants = {
    rootUrl: 'https://www.bcpl.info/blog',
    selectors: {
        printButton: 'a.print',
		shareButton: '.addthis_button_compact',
		addThisModal: '.at-expanded-menu-mask'
    }
};

describe('Print / Share', () => {
    before(() => {
        cy.visit(constants.rootUrl);
    });

    describe('Print Button', () => {
        beforeEach(() => {
            cy.get(constants.selectors.printButton).as('printButton');
        });

        it('should exist', () => {
            cy.get('@printButton').should('exist');
        });

        it('should perform a window.print() on click', () => {
            cy.get('@printButton').then(btn => {
                const doesCallWindowOnPrint =
                    btn[0].onclick.toString().indexOf('') > -1;
                expect(doesCallWindowOnPrint).to.be.equal(true);
            });
        });
    });

    describe('Share', () => {
        beforeEach(() => {
            cy.get(constants.selectors.shareButton).as('shareButton');
        });

        it('should exist', () => {
            cy.get('@shareButton').should('exist');
        });

		// TODO: This script takes forver, so we can't really test this functionality
        // it('should show the add this share model when selected', () => {
		// 	cy.get('@shareButton').click();

		// 	cy.get(constants.selectors.addThisModal).should('be.visible');
        // });
    });
});
