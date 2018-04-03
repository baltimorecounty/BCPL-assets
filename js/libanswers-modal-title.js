(function init($, constants) {
	const libAnswersModalSelector = '#s-la-widget-modal';
	const modalTitleSelector = '.modal-title';

	const getBranchId = ($contactForm) => {
		const idParts = $contactForm.attr('id').split('_');
		return idParts[idParts.length - 1];
	};
	const getBranchName = (branchId) => {
		const $branchEmailDiv = $(`#s-la-widget-${branchId}`);
		return $branchEmailDiv.closest('card').find('.branch-name').text().trim();
	};
	const getModalTitle = (branchName, branchId) => branchName && branchName.toLowerCase().indexOf('mobile services') > -1
		? `Email the ${branchName}`
		: constants.libAnswers.generalBranchId === parseInt(branchId, 10)
			? 'Email a General Question or Request'
			: `Email the ${branchName} Branch`;

	const onModalShow = (showEvent) => {
		const $modal = $(showEvent.currentTarget);
		const $contactForm = $modal.find('form');

		const branchId = getBranchId($contactForm);
		const branchName = getBranchName(branchId);

		if (!branchName) return;

		const modalTitle = getModalTitle(branchName, branchId);

		$modal
			.find(modalTitleSelector)
			.text(modalTitle);
	};
	$(document).on('show.bs.modal', libAnswersModalSelector, onModalShow);
}(jQuery, bcpl.constants));
