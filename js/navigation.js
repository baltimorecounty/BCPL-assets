namespacer("bcpl");

bcpl.navigation = (($, keyCodes) => {
  const navButtonSelector =
    ".nav-and-search:not(.search-is-active) #responsive-sliding-navigation button";
  const closestMenuNodeSelector = "#responsive-sliding-navigation>ul>li";
  const searchArtifactsSelector = "#activate-search-button, #search-box";
  const heroCalloutContainerSelector = ".hero-callout-container";
  const activeLinksSelector = ".active, .clicked";
  const activeMenuButtonSelector = "li.active button";
  const subMenuClass = "sub-menu";
  const backButtonSelector = ".window-back";
  const mobileWidthThreshold = 768;

  const isMobileWidth = ($element, threshold) =>
    parseFloat($element.width()) <= threshold;

  const isSlideNavigationVisible = () => $("body").hasClass("nav-visible");

  const focusFirstActiveMenuLink = (callback) => {
    $("#responsive-sliding-navigation li.active a").first().focus();

    if (typeof callback === "function") {
      callback();
    }
  };

  const findClosestButtonToLink = ($link) =>
    $link.closest(closestMenuNodeSelector).find("button");

  const afterSubmenuActivated = (target, afterAnimationCallback) => {
    $(target).find("ul").attr("aria-hidden", false);

    if (
      afterAnimationCallback &&
      typeof afterAnimationCallback === "function"
    ) {
      afterAnimationCallback();
    }
  };

  const activateSubmenu = ($button, afterAnimationCallback) => {
    const animationOptions = isSlideNavigationVisible() ? { right: "0px" } : {};
    const animationSpeed = isSlideNavigationVisible() ? 250 : 0;
    $button
      .attr("aria-expanded", true)
      .closest("li")
      .addClass("active")
      .find(".submenu-wrapper")
      .animate(animationOptions, animationSpeed, function afterAnimation() {
        afterSubmenuActivated(this, afterAnimationCallback);
      });
  };

  const afterSubmenuDeactivated = (target, afterAnimationCallback) => {
    $(target)
      .siblings("button")
      .attr("aria-expanded", false)
      .closest("li")
      .removeClass("active")
      .attr("aria-hidden", true);

    if (
      afterAnimationCallback &&
      typeof afterAnimationCallback === "function"
    ) {
      afterAnimationCallback();
    }
  };

  const deactivateSubmenu = ($button, afterAnimationCallback) => {
    const animationOptions = isSlideNavigationVisible()
      ? { right: "-300px" }
      : {};
    const animationSpeed = isSlideNavigationVisible() ? 250 : 0;
    $button
      .siblings(".submenu-wrapper")
      .animate(animationOptions, animationSpeed, function afterAnimation() {
        afterSubmenuDeactivated(this, afterAnimationCallback);
      });
  };

  const removeActiveClassFromAllButtons = () =>
    deactivateSubmenu(
      $("#responsive-sliding-navigation").find(activeMenuButtonSelector)
    );

  const hideSearchBox = () => $(searchArtifactsSelector).removeClass("active");

  const hideHeroCallout = (shouldHide) => {
    if (shouldHide && !isMobileWidth($("body"), mobileWidthThreshold)) {
      $(heroCalloutContainerSelector).hide();
    } else {
      $(heroCalloutContainerSelector).show();
    }
  };

  const navButtonClicked = (event) => {
    if (window.innerWidth <= mobileWidthThreshold) {
      const $button = $(event.currentTarget);
      const wasActive = $button.closest("li").hasClass("active");
      const $closestMenu = $button.closest("ul");
      hideSearchBox();
      removeActiveClassFromAllButtons();
      if (!wasActive) {
        activateSubmenu($button);
        $closestMenu.addClass(subMenuClass);
      } else {
        deactivateSubmenu($button);
        $closestMenu.removeClass(subMenuClass);
      }
      hideHeroCallout(!wasActive);
    }
  };

  const navigationKeyPressed = (keyboardEvent) => {
    const keyCode = keyboardEvent.which || keyboardEvent.keyCode;
    const $button = $(keyboardEvent.currentTarget)
      .closest("#responsive-sliding-navigation")
      .find(activeMenuButtonSelector);

    switch (keyCode) {
      case keyCodes.escape:
        deactivateSubmenu($button);
        $button.focus();
        hideHeroCallout(false);
        break;
      default:
        break;
    }
  };

  const navigationButtonKeyPressed = (keyboardEvent) => {
    const keyCode = keyboardEvent.which || keyboardEvent.keyCode;
    const $button = $(keyboardEvent.currentTarget);

    switch (keyCode) {
      case keyCodes.rightArrow:
        keyboardEvent.preventDefault();
        deactivateSubmenu($button);
        $button.parent().next().find("button").focus();
        break;
      case keyCodes.leftArrow:
        keyboardEvent.preventDefault();
        deactivateSubmenu($button);
        $button.parent().prev().find("button").focus();
        break;
      case keyCodes.downArrow:
      case keyCodes.upArrow:
      case keyCodes.enter:
        const $searchArtifactsSelector = $(searchArtifactsSelector);

        keyboardEvent.preventDefault();
        removeActiveClassFromAllButtons();
        activateSubmenu($button);
        $button.siblings(".submenu-wrapper").find("a:visible").first().focus();

        if ($searchArtifactsSelector.is(":visible")) {
          hideSearchBox();
        }
        break;
      default:
        break;
    }
  };

  const navigationMenuItemKeyPressed = (keyboardEvent) => {
    const keyCode = keyboardEvent.which || keyboardEvent.keyCode;
    const $link = $(keyboardEvent.currentTarget);
    const $allActiveLinks = $link
      .closest(activeLinksSelector)
      .find("a:visible");
    const $button = findClosestButtonToLink($link);

    switch (keyCode) {
      case keyCodes.upArrow:
        keyboardEvent.preventDefault();
        if ($allActiveLinks.index($link) - 1 === -1) {
          $allActiveLinks.eq(0).focus();
        } else {
          $allActiveLinks.eq($allActiveLinks.index($link) - 1).focus();
        }
        break;
      case keyCodes.leftArrow:
        keyboardEvent.preventDefault();
        if ($link.closest(closestMenuNodeSelector).prev("li").length) {
          deactivateSubmenu($button, () => {
            activateSubmenu(
              $link.closest(closestMenuNodeSelector).prev("li").find("button")
            );
            focusFirstActiveMenuLink();
          });
        }
        break;
      case keyCodes.downArrow:
        keyboardEvent.preventDefault();
        $allActiveLinks.eq($allActiveLinks.index($link) + 1).focus();
        break;
      case keyCodes.rightArrow:
        keyboardEvent.preventDefault();
        if ($link.closest(closestMenuNodeSelector).next("li").length) {
          deactivateSubmenu($button, () => {
            activateSubmenu(
              $link.closest(closestMenuNodeSelector).next("li").find("button")
            );
            focusFirstActiveMenuLink();
          });
        }
        break;
      case keyCodes.space:
      case keyCodes.enter:
        keyboardEvent.preventDefault();
        $link[0].click();
        removeActiveClassFromAllButtons();

        break;
      default:
        break;
    }
  };

  const onBackButtonClicked = (clickEvent) => {
    clickEvent.preventDefault();
    window.history.back();
  };

  const stopNavMouseOver = (targetTimeout) => {
    clearTimeout(targetTimeout);
  };

  let mouseHoverDelay;

  const navigationMouseover = (mouseOverEvent) => {
    if (window.window.innerWidth > mobileWidthThreshold) {
      stopNavMouseOver(mouseHoverDelay);

      mouseHoverDelay = setTimeout(() => {
        const $navItem = $(mouseOverEvent.target);
        $navItem
          .closest("li")
          .siblings()
          .removeClass("active")
          .end()
          .addClass("active");
        hideHeroCallout(true);
        hideSearchBox();
      }, 250);
    }
  };

  const navigationMouseleave = (mouseEvent) => {
    const isNextElementANavElement = $(mouseEvent.relatedTarget).closest(
      "#responsive-sliding-navigation"
    ).length;

    if (
      !isNextElementANavElement &&
      !isMobileWidth($("body"), mobileWidthThreshold)
    ) {
      stopNavMouseOver(mouseHoverDelay);
      removeActiveClassFromAllButtons();
      hideHeroCallout(false);
    }
  };

  const closeMenu = (event) => {
    $("ul li.active").each(function (i) {
      if (event.key === "Escape") {
        $(this).removeClass("active");
      }
    });
  };

  $(document)
    .on(
      "mouseover",
      ".nav-and-search:not(.search-is-active) #responsive-sliding-navigation button, #responsive-sliding-navigation .submenu-wrapper",
      navigationMouseover
    )
    .on(
      "mouseleave",
      ".nav-and-search:not(.search-is-active) #responsive-sliding-navigation button, #responsive-sliding-navigation .submenu-wrapper",
      navigationMouseleave
    )
    .on(
      "keydown",
      "#responsive-sliding-navigation button",
      navigationButtonKeyPressed
    )
    .on("keydown", closeMenu)
    .on("keydown", "#responsive-sliding-navigation", navigationKeyPressed)
    .on("click", navButtonSelector, navButtonClicked)
    .on("click", backButtonSelector, onBackButtonClicked)
    .on(
      "keydown",
      "#responsive-sliding-navigation a",
      navigationMenuItemKeyPressed
    );

  /* test-code */
  return {
    isMobileWidth,
    isSlideNavigationVisible,
    focusFirstActiveMenuLink,
    findClosestButtonToLink,
    afterSubmenuActivated,
  };
  /* end-test-code */
})(jQuery, bcpl.constants.keyCodes);
