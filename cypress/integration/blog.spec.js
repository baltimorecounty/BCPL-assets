const constants = {
	rootUrl: 'https://www.bcpl.info/blog',
	selectors: {
		blogPost: '.blog-post',
		cardCalloutLink: '.card-icon-callout a',
		cardHeadingLink: '.card-heading a',
		cardImageLink: '.card-content-img-container a',
		cardImageImg: '.card-content-img-container img',
		listItem: '.SEContent .card'
	}
};

describe('Blog', () => {
	before(() => {
		cy.visit(constants.rootUrl);
	});

	describe('Home Page', () => {
		beforeEach(() => {
			cy.get(constants.selectors.listItem).as('listItems');
			cy
				.get('@listItems')
				.first()
				.as('firstBlogPost');
		});

		it('should display the Blog Homepage', () => {
			// if the before passes this mean the homepage is loaded
		});

		it('should display a list of blog posts', () => {
			cy.get('@listItems').then(blogEntries => {
				expect(blogEntries.length).to.be.greaterThan(0);
			});
		});

		it('should have a preview image linked to the post', () => {
			cy
				.get('@firstBlogPost')
				.find(constants.selectors.cardImageLink)
				.should('have.attr', 'href');
		});

		it('should have a title that is linked to the post', () => {
			cy
				.get('@firstBlogPost')
				.find(constants.selectors.cardHeadingLink)
				.should('have.attr', 'href');
		});

		it('should have a content image, but it should not be clickable', () => {
			cy
				.get('@firstBlogPost')
				.find(constants.selectors.cardCalloutLink)
				.should('not.exist');
		});
	});

	describe('Blog Post', () => {
        before(() => {
            cy
                .get(constants.selectors.listItem)
                .first()
                .find(constants.selectors.cardImageImg)
                .first()
                .click(); // Visit the first blog entry
        });

		it('should display the first blog post', () => {
			// if the before passes this mean the first blog post is loaded
		});

		describe('Blog Details', () => {
			let blogAuthor;
			let blogDate;

			before(() => {
				cy
					.get(constants.selectors.blogPost)
					.find('p')
					.first()
					.then(blogDetails => {
						const blogDetailParts = blogDetails[0].innerText
							.split('|')
							.map(detail => detail.trim());
						blogAuthor = blogDetailParts[1];
						blogDate = blogDetailParts[0];
					});
			});

			it('should display a date for the blog post', () => {
				expect(blogDate.length).to.be.above(0);
			});

			it('should display an author for the blog post', () => {
				const authorContainsBy = blogAuthor.indexOf('By') > -1;

				expect(authorContainsBy).to.equal(true);
				expect(blogAuthor.length).to.be.above(0);
			});
		});
	});
});
