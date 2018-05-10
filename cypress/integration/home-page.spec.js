const constants = {
    rootUrl: 'https://www.bcpl.info/',
    fictionLink:
        'https://catalog.bcpl.lib.md.us/polaris/search/searchresults.aspx?ctx=1.1033.0.0.5&type=Boolean&term=brs=110016&by=KW&sort=RELEVANCE&limit=&query=&page=0',
    selectors: {
        carouselInitilized: '.slick-initialized',
        carouselSlide: '.slick-slide.slick-active',
        carouselDotsControl: '.slick-dots button',
        learnMoreLink: '.slick-slide.slick-active .callout a',
        featuredEventsContainer: '#events-target',
        featuredEvents: 'featured-events a.post',
        viewAllEventsButtons: '.events .feed a.solo',
        blogContainer: '.blog-widget',
        blogPost: '.blog-widget .blog-widget-item',
        viewTheBlogButton: '.blog-wrapper a.feed',
        recommendedTitleContainer: '.recommended-titles-wrapper',
        tabControl: '.tab-control',
        activeTab: '.tab-control.active',
        bookCarousel: '.book-carousel',
        recommendedTitlesArrows: '.slick-arrow'
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

            //TODO: maybe we can assert that the id is in the new location

            assertLocationChanged();
        });

        it('should navigate you to the events page when the view all events button is selected', () => {
            cy.visit(constants.rootUrl);

            cy
                .wait(1000)
                .get(constants.selectors.viewAllEventsButtons)
                .first()
                .click();

            assertLocationChanged();
        });
    });

    describe('From the Blog', () => {
        before(() => {
            cy.visit(constants.rootUrl);
        });

        it('should show four blog posts', () => {
            cy
                .get(constants.selectors.blogPost)
                .its('length')
                .should('eq', 4);
        });

        it('should navigate to a specific blog post', () => {
            cy
                .get(constants.selectors.blogPost)
                .first()
                .find('a')
                .click();

            assertLocationChanged();
        });

        it('should navigate a list of blog posts when view the blog is selecoted', () => {
            cy.visit(constants.rootUrl);

            cy.get(constants.selectors.viewTheBlogButton).click();

            assertLocationChanged();
        });
    });

    describe('Recommended Titles', () => {
        const assertVisibleTitlesChanged = titleElms => {
            Array.prototype.slice.call(titleElms).forEach(titleElm => {
                const isMatch = visibleTitles.includes(titleElm.innerText);
                expect(isMatch).to.be.equal(false);
            });
        };

        const getActiveTab = () =>
            cy
                .get(constants.selectors.recommendedTitleContainer)
                .find(constants.selectors.activeTab);

        const getCarouselArrow = () =>
            cy
                .get(constants.selectors.bookCarousel)
                .first()
                .find(constants.selectors.recommendedTitlesArrows);

        const getVisibleTitles = callback => {
            cy
                .get(constants.selectors.bookCarousel)
                .first()
                .find('p:visible')
                .then(callback);
        };

        const setVisibleTitles = titleElms => {
            Array.prototype.slice.call(titleElms).forEach(titleElm => {
                visibleTitles.push(titleElm.innerText);
            });
        };
        
        let visibleTitles;
        before(() => {
            cy.visit(constants.rootUrl);
        });

        beforeEach(() => {
            visibleTitles = [];
        });

        it('should initally have the fiction tab selected', () => {
            getActiveTab().contains('Fiction');
        });

        it('should allow users to move through titles using the previous arrow in the control', () => {
            getVisibleTitles(setVisibleTitles);

            getCarouselArrow()
                .first()
                .click()
                .wait(500);

            getVisibleTitles(assertVisibleTitlesChanged);
        });

        it('should allow users to move through titles using the next arrow in the control', () => {
            getVisibleTitles(setVisibleTitles);

            getCarouselArrow()
                .last()
                .click()
                .wait(500);

            getVisibleTitles(assertVisibleTitlesChanged);
        });

        it('should link to the recommended title page', () => {
            cy
                .get(constants.selectors.recommendedTitleContainer)
                .find(`a[href="${constants.fictionLink}"]`)
                .should('exist');
        });

        it('should change categories when switching tabs ', () => {
            cy
                .get(constants.selectors.recommendedTitleContainer)
                .find(constants.selectors.tabControl)
                .last()
                .click();

            getActiveTab().then(activeTabElm => {
                expect(activeTabElm[0].innerText.toLowerCase()).to.not.be.equal(
                    'fiction'
                );
            });
        });
    });
});
