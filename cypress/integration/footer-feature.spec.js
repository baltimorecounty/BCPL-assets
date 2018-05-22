const constants = {
    rootUrl: 'https://bcpl.info/',
    selectors: {
        socialLinks: '.social a',
        contraster: 'li.contraster',
        menuInnerWrapper: 'menu-inner-wrapper',
        followWrapper: 'follow-wrapper',
        calloutDivs: '.callouts-wrapper .callout',
        toTopButton: 'scroll-to-top',
        translateMenuItems: '.goog-te-menu2-item',
        htmlTranslated: '.translated-ltr'
    }
}

describe('Footer Features', () => {
    
    before(() => {
        cy.visit(constants.rootUrl);
    });

    describe('Social Links', () => {
        
        it('should contain a Facbook icon that points to the baltimore county Facebook page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-facebook`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.facebook.com/bcplonline');
        });

        it('should contain a Twitter icon that points to the baltimore county Twitter page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-twitter`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.twitter.com/bcplinfo');
        });

        it('should contain a Youtube icon that points to the baltimore county Youtube page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-youtube`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.youtube.com/user/bcplonline');
        });

        it('should contain a Flickr icon that points to the Baltimore County Flickr page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-flickr`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.flickr.com/photos/bcplphoto');
        });

        it('should contain an Instagram icon that points to the Baltimore County Instagram page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-instagram`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.instagram.com/bcplinfo');
        });

    });

    describe('Promotions', () => {
        
        it('should contain a link that navigates to the BCPL Home Page', () => {
            cy
                .get(`${constants.selectors.calloutDivs} .logo`)
                .should('have.attr', 'href', '/');
        });

        it('should contain a link that navigates to Admin Office address on Google Maps', () => {
            cy
                .get(`${constants.selectors.calloutDivs}`)
                .contains('Directions')
                .should('have.attr', 'href', "https://www.google.com/maps/dir/''/320+York+Rd,+Towson,+MD+21204");
        });

        it('should contain a link that navigates to the Ask A Librarian page', () => {
            cy
                .get(`${constants.selectors.calloutDivs}`)
                .contains('Ask a Librarian')
                .should('have.attr', 'href', "/services/ask-a-librarian.html");
        });

        it('should contain a link that navigates to the Digital Library page', () => {
            cy
                .get(`${constants.selectors.calloutDivs}`)
                .contains('Explore Digital Materials')
                .should('have.attr', 'href', "/books-and-more/downloadables.html");
        });

        it('should contain a link that navigates to the Job Opportunities page', () => {
            cy
                .get(`${constants.selectors.calloutDivs}`)
                .contains('Search Jobs')
                .should('have.attr', 'href', "/about-us/job-opportunities.html");
        });

    });

    describe('Bottom Nav', () => {
        // These tests currently take a long time due to cy.visit()
        // waiting for onLoad to complete. Cypress will be adding the ability
        // to complete on DOMContentLoaded which may speed up tests.
        // Open issue : https://github.com/cypress-io/cypress/issues/440

        beforeEach(() => {
            cy.visit(constants.rootUrl);
        });

        it('should conatin a text link containing "User Terms" that points to the policies page', () => {
            cy
                .contains('a', 'User Terms')
                .should('have.attr', 'href', '/about-us/policies.html#user-terms')
                .click();

            cy
                .get('a[name=user-terms]')
                .should('exist');
        });

        it('should conatin a text link containing "Privacy Policy" that points to the policies page', () => {
            cy
                .contains('a', 'Privacy Policy')
                .should('have.attr', 'href', '/about-us/policies.html#privacy-policy')
                .click();

            cy
                .get('a[name=privacy-policy]')
                .should('exist');
        });

        it('should conatin a text link containing "Accessibility" that points to the policies page', () => {
            cy
                .contains('a', 'Accessibility')
                .should('have.attr', 'href', '/about-us/policies.html#accessibility-statement')
                .click();

            cy
                .get('a[name=accessibility-statement]')
                .should('exist');
        });

    });

    describe('Adjust Contrast', () => {
        // Backup the clear function.
        // This is going to be set to null below...
        const clear = Cypress.LocalStorage.clear;

        const assertIsHighContrast = () => {

            cy
                .window()
                .its('localStorage')
                .its('isHighContrast')
                .should('eq', 'true');

        };

        const assertIsNotHighContrast = () => {

            cy
                .window()
                .its('localStorage')
                .its('isHighContrast')
                .should('eq', 'false');

        };

        before(() => {
            cy.visit(constants.rootUrl);
        });

        it('should contain a contraster', () => {
            cy
                .get(constants.selectors.contraster)
                .should('exist');
        });

        it('should toggle and change the page colors to high contrast', () => {
            cy
                .get(constants.selectors.contraster)
                .click();

            assertIsHighContrast();
        });
        
        it('should toggle and change page colors back', () => {
            cy
                .get(constants.selectors.contraster)
                .click();

            assertIsNotHighContrast();
        });
        
        it('should toggle when "Adjust Contrast" is clicked', () => {
            cy
                .get(constants.selectors.contraster)
                .contains('Adjust Contrast')
                .click();

            assertIsHighContrast();

            // Cypress automatically clears local storage between tests
            // Temporarily removing the clear function allows local storage to persist
            // Customizable lifecycle event will be available in a future release
            // https://github.com/cypress-io/cypress/issues/686
            Cypress.LocalStorage.clear = null;
        });
        
        it('should keep contrast colors on other pages', () => {
            cy
                .get(`${constants.selectors.calloutDivs}`)
                .contains('Ask a Librarian')
                .click();

            assertIsHighContrast();

            // Re-assign the clear function
            Cypress.LocalStorage.clear = clear;
        });

    });

    describe('Translate', () => {
        
        it('should contain a google translate gadget', () => {
            // TODO: I could not figure out how to stub this properly.
        });
        
    });

});