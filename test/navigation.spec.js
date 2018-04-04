describe('Navigation', () => {
	describe('isMobileWidth', () => {
		let $testElement;

		beforeAll(() => {
			$testElement = {
				width: () => {
					return 1000;
				}
			};
		});

		it('should return false when element width is above threshold', () => {
			const experimental = bcpl.navigation.isMobileWidth($testElement, 500);

			expect(experimental).toBe(false);
		});
		it('should return true when element width is equal to threshold', () => {
			const experimental = bcpl.navigation.isMobileWidth($testElement, 1000);

			expect(experimental).toBe(true);
		});
		it('should return true when element width is below threshold', () => {
			const experimental = bcpl.navigation.isMobileWidth($testElement, 1500);

			expect(experimental).toBe(true);
		});
	});

	describe('isSlideNavigationVisible', () => {
		it('should be false when the "nav-visible" class is not present on the body element', () => {
			$('body').removeClass('nav-visible');

			const experimental = bcpl.navigation.isSlideNavigationVisible();

			expect(experimental).toBe(false);
		});

		it('should be true when the "nav-visible" class is present on the body element', () => {
			$('body').addClass('nav-visible');

			const experimental = bcpl.navigation.isSlideNavigationVisible();

			expect(experimental).toBe(true);
		});
	});

	describe('findClosestButtonToLink', () => {
		beforeAll((done) => {
			loadFixtures('menuAndModal.fixture.html');
			done();
		});

		it('should return the corresponding button for a given link', () => {
			const count = $('nav li li a').length;
			const randomLinkIndex = Math.floor(Math.random() * count);
			const $randomLink = $('nav li li a').eq(randomLinkIndex);
			const $actualButton = $randomLink.closest('nav>ul>li').find('button');

			const $experimental = bcpl.navigation.findClosestButtonToLink($randomLink);

			expect($experimental.is($actualButton)).toBe(true);
		});
	});

	describe('afterSubmenuActivated', () => {});

	describe('activateSubmenu', () => {});

	describe('afterSubmenuDeactivated', () => {});

	describe('deactivateSubmenu', () => {});

	describe('removeActiveClassFromAllButtons', () => {});

	describe('hideSearchBox', () => {});

	describe('hideHeroCallout', () => {});

	describe('navButtonClicked', () => {});

	describe('navigationKeyPressed', () => {});

	describe('navigationButtonKeyPressed', () => {});

	describe('navigationMenuItemKeyPressed', () => {});

	describe('navigationMouseover', () => {});

	describe('navigationMouseleave', () => {});
});
