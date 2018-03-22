// Used on bcpl_askalibrarian form

namespacer('bcpl.pageSpecific');

bcpl.branchEmailSwitcher = (($) => {
	let branchData = [];

	const findBranchEmail = (searchTerm) => {
		const foundEmail = branchData.find((branchEmailItem) => {
			if (branchEmailItem && branchEmailItem.myLibrarianEmail && typeof branchEmailItem.myLibrarianEmail === 'string') {
				return branchEmailItem.myLibrarianEmail.toLowerCase() === searchTerm.toLowerCase();
			}

			return false;
		});

		return foundEmail || '';
	};

	const branchChangeHandler = (changeEvent) => {
		const branchSelectionValue = $(changeEvent.target).val();
		const branchEmailItem = findBranchEmail(branchSelectionValue);

		$('#_seResultMail').val(branchEmailItem.email);
	};

	const branchDataSuccessHandler = (branchJsonResponse) => {
		branchData = branchJsonResponse.data;
	};

	const branchDataErrorHandler = (error) => {
		console.error(error);
	};

	$.ajax('/sebin/q/r/branch-amenities.json').then(branchDataSuccessHandler, branchDataErrorHandler);

	$(document).on('change', '#whichBranch', branchChangeHandler);
})(jQuery);
