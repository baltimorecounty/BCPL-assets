'use strict';

// Used on bcpl_askalibrarian form

namespacer('bcpl.pageSpecific');

bcpl.branchEmailSwitcher = function ($) {
	var branchData = [];

	var findBranchEmail = function findBranchEmail(searchTerm) {
		var foundEmail = branchData.find(function (branchEmailItem) {
			if (branchEmailItem && branchEmailItem.myLibrarianEmail && typeof branchEmailItem.myLibrarianEmail === 'string') {
				return branchEmailItem.myLibrarianEmail.toLowerCase() === searchTerm.toLowerCase();
			}

			return false;
		});

		return foundEmail || '';
	};

	var branchChangeHandler = function branchChangeHandler(changeEvent) {
		var branchSelectionValue = $(changeEvent.target).val();
		var branchEmailItem = findBranchEmail(branchSelectionValue);

		$('#_seResultMail').val(branchEmailItem.email);
	};

	var branchDataSuccessHandler = function branchDataSuccessHandler(branchJsonResponse) {
		branchData = branchJsonResponse.data;
	};

	var branchDataErrorHandler = function branchDataErrorHandler(error) {
		console.error(error);
	};

	$.ajax('/sebin/q/r/branch-amenities.json').then(branchDataSuccessHandler, branchDataErrorHandler);

	$(document).on('change', '#whichBranch', branchChangeHandler);
}(jQuery);