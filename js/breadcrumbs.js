/**
 * Requires jQuery and Bootstrap
 */
namespacer('bcpl');

bcpl.breadCrumbs = (function breadCrumbs($) {
	const templates = {
		popover: '<div class="popover breadcrumb-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	};
	const classNames = {
		firstBreadCrumb: 'breadcrumb-first',
		hiddenBreadCrumbContainer: 'hidden-breadcrumb-container',
		hiddenBreadCrumbTrigger: 'hidden-breadcrumb-trigger',
		hiddenBreadCrumbPopover: 'hidden-breadcrumb-popover'
	};

	const buildBreadCrumbHtml = (hiddenBreadCrumbTriggerClassName) => {
		const hiddenBreadCrumbTriggerHtml = buildBreadCrumbTrigger(hiddenBreadCrumbTriggerClassName);
		return `<div class="${classNames.hiddenBreadCrumbContainer} ${classNames.hiddenBreadCrumbPopover} breadcrumb breadcrumb-alt" data-toggle="popover" id="tip1"><div class="tooltip-arrow"></div>${hiddenBreadCrumbTriggerHtml}</div>`;
	};

	const buildBreadCrumbList = ($hiddenBreadCrumbs) => {
		const listItems = $hiddenBreadCrumbs.toArray().map((hiddenBreadCrumbElm) => {
			const $clonedBreadCrumb = $(hiddenBreadCrumbElm).clone();
			$clonedBreadCrumb.removeClass('breadcrumb').removeAttr('style');

			return `<li>${$clonedBreadCrumb[0].outerHTML}</li>`;
		}).join('');

		return listItems.length ? `<ul class="hidden-breadcrumb-list">${listItems}</ul>` : '';
	};

	const buildBreadCrumbTrigger = (breadCrumbTrigger) => `<span class="${breadCrumbTrigger}"><i class="fa fa-circle" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i></span>`;

	const cleanBreadCrumbs = () => {
		const breadCrumbContainer = '.breadcrumbs-wrapper';
		const childSelector = '.breadcrumbs-wrapper a, .breadcrumbs-wrapper span';
		const $childHtml = $(childSelector);

		$childHtml.html((i, html) => html.replace(/(?:\r\n|\r|\n|&nbsp;)/g, ''));

		$(childSelector).remove();

		$(breadCrumbContainer)
			.append($childHtml);
	};

	const collapseBreadCrumbs = ($breadCrumbs) => {
		$breadCrumbs.hide();
	};

	const createHiddenBreadCrumbs = () => {
		const hiddenBreadCrumbHtml = buildBreadCrumbHtml(classNames.hiddenBreadCrumbTrigger);

		$(`.${classNames.firstBreadCrumb}`).after(hiddenBreadCrumbHtml);
	};

	const $getBreadCrumbs = () => $('.breadcrumbs-wrapper').find('.breadcrumb');

	const $getBreadCrumbsToHide = ($breadCrumbs) => $breadCrumbs.not(':first,:last');

	const initHiddenBreadCrumbsPopover = ($hiddenBreadCrumbs) => {
		const hiddenBreadCrumbList = buildBreadCrumbList($hiddenBreadCrumbs);
		$(`.${classNames.hiddenBreadCrumbPopover}`).popover({
			content: hiddenBreadCrumbList,
			html: true,
			placement: 'bottom',
			template: templates.popover
		});
	};
	const onHiddenBreadCrumbTriggerClick = (clickEvent) => {
		$(clickEvent.currentTarget).toggleClass('active');
	};

	const init = (breadcrumbThreshold) => {
		const breadcrumbThresholdLimit = breadcrumbThreshold || 3;

		$(function onDocumentReady() {
			cleanBreadCrumbs();

			const $breadCrumbs = $getBreadCrumbs();
			const numberOfBreadCrumbs = $breadCrumbs.length;

			if (numberOfBreadCrumbs > breadcrumbThresholdLimit) {
				const $hiddenBreadCrumbs = $getBreadCrumbsToHide($breadCrumbs);

				collapseBreadCrumbs($hiddenBreadCrumbs);

				createHiddenBreadCrumbs();

				initHiddenBreadCrumbsPopover($hiddenBreadCrumbs);
			}
		});
	};

	$(document).on('click', '.hidden-breadcrumb-container', onHiddenBreadCrumbTriggerClick);

	return {
		cleanBreadCrumbs,
		collapseBreadCrumbs,
		$getBreadCrumbs,
		$getBreadCrumbsToHide,
		init
	};
}(jQuery));

bcpl.breadCrumbs.init();

