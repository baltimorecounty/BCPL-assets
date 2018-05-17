const constants = {
    rootUrl: 'https://bcpl.info/',
    selectors: {
        socialLinks: '.social a',
        contraster: 'li.contraster',
        menuInnerWrapper: 'menu-inner-wrapper',
        followWrapper: 'follow-wrapper',
        calloutDivs: '.callouts-wrapper .callout',
        toTopButton: 'scroll-to-top',
        translateGadget: '#google_translate_element',
        translateMenuItems: '.goog-te-menu2-item',
        htmlTranslated: '.translated-ltr'
    }
}

describe('Footer Features', () => {
    
    before(() => {
        cy.visit(constants.rootUrl);
    });

    /*describe('Social Links', () => {
        // 1. Verify the social links work.
        it('should contain a facbook icon that points to the baltimore county facebook page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-facebook`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.facebook.com/bcplonline');
        });

        it('should contain a twitter icon that points to the baltimore county twitter page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-twitter`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.twitter.com/bcplinfo');
        });

        it('should contain a youtube icon that points to the baltimore county youtube page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-youtube`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.youtube.com/user/bcplonline');
        });

        it('should contain a flickr icon that points to the baltimore county flickr page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-flickr`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.flickr.com/photos/bcplphoto');
        });

        it('should contain a instagram icon that points to the baltimore county instagram page', () => {
            cy
                .get(`${constants.selectors.socialLinks} .fa-instagram`)
                .should('exist')
                .parent()
                .should('have.attr', 'href', 'https://www.instagram.com/bcplinfo');
        });

    });*/

    /*describe('Promotions', () => {
        // 1. Verify all links work.
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

    });*/

    /*describe('Bottom Nav', () => {
        // 1. Verify all links work.

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

    });*/

    /*describe('Adjust Contrast', () => {

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

        // 1. Verify the Adjust Contrast toggle button changes the page colors to a higher contrast version.
        it('should toggle and change the page colors to high contrast', () => {
            cy
                .get(constants.selectors.contraster)
                .click();

            assertIsHighContrast();
        });

        // 2. Verify that the Adjust Contrast toggles back when selected another time.
        it('should toggle and change page colors back', () => {
            cy
                .get(constants.selectors.contraster)
                .click();

            assertIsNotHighContrast();
        });

        // 3. Verify the words "Adjust Contrast" also toggle the button.
        it('should toggle when "Adjust Contrast" is clicked', () => {
            cy
                .get(constants.selectors.contraster)
                .contains('Adjust Contrast')
                .click();

            assertIsHighContrast();
        });

        // 4. Verify contrast changes persist when navigating to another page.
        it('should keep contrast colors on other pages', () => {
            cy.visit('https://www.bcpl.info/about-us/policies.html');

            assertIsHighContrast();
        });

    });*/

    describe('Translate', () => {
        // 1. Verify the translate select toggles languages.
        it('should contain a google translate gadget', () => {
            cy
                .get(constants.selectors.translateGadget)
                .should('exist');
        });

        it('should toggle to the selected language', () => {
            cy
                .get(constants.selectors.translateGadget)
                .click();

            cy
                .get(constants.selectors.translateMenuItems)
                .contains('Korean')
                .click();

            cy
                .get(constants.selectors.htmlTranslated)
                .should('exist');
        });
    });

});