const constants = {
    rootUrl: 'https://www.bcpl.info/',
    selectors: {
        carouselInitilized: '.slick-initialized',
        carouselSlide: '.slick-slide.slick-active',
        carouselDotsControl: '.slick-dots button',
        learnMoreLink: '.slick-slide.slick-active .callout a',
        featuredEventsContainer: '#events-target',
        featuredEvents: 'featured-events a.post'
    }
};

describe('BCPL Home Page', () => {
    let firstSlideImg;

    const assertLocationChanged = () => {
        cy
            .location()
            .its('href')
            .should('not.eq', constants.rootUrl);
        };

    before(() => {
        cy.visit(constants.rootUrl);
    });

    describe('Carousel', () => {
        it('should initialize the carousel', () => {
            cy.get(constants.selectors.carouselInitilized).should('exist');
        });

        it('should change slides when a dot is selected', () => {
            cy
                .get(constants.selectors.carouselSlide)
                .first()
                .then(slide => {
                    firstSlideImg = slide[0].attributes['style'];
                });

            cy
                .get(constants.selectors.carouselDotsControl)
                .last()
                .click();

            cy
                .get(constants.selectors.carouselSlide)
                .first()
                .then(slide => {
                    expect(firstSlideImg).to.not.be.equal(
                        slide[0].attributes['style']
                    );
                });
        });

        it('should go to another page when the learn more link is selected', () => {
            cy
                .get(constants.selectors.learnMoreLink)
                .first()
                .should('exist')
                .click();
                
            assertLocationChanged();            
        });
    });

    describe('Featured Events', () => {
        before(() => {
            cy.visit(constants.rootUrl);
        });

        it('should show the featured events widget', () => {
            cy.get(constants.selectors.featuredEventsContainer).should('exist');
        });

        it('should show the 4 featured events', () => {
            cy
                .wait(1000)
                .get(constants.selectors.featuredEvents)
                .its('length')
                .should('eq', 4);
        });

        it('should navigate you to the specific events page when the event is selected', () => {

            cy
                .wait(1000)
                .get(constants.selectors.featuredEvents)
                .first()
                .click();
            
            //TODO: maybe we can asser that the id is in the new location

            assertLocationChanged();
        });
    });

    describe('From the Blog', () => {});

    describe('Recommended Titles', () => {});
});
