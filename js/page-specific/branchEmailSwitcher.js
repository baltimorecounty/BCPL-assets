// Used on bcpl_askalibrarian form
// Not using namespacer since I can only load one file on the form.
// Not extracting this to a module since I can only load one file on the form.
// Not using constants since I can only load one file on the form.

const bcpl = window.bcpl || {};
bcpl.pageSpecific = bcpl.pageSpecific || {};

(() => {
	const jqueryTag = document.createElement('script');
	jqueryTag.src = '/sebin/z/y/jquery.min.js';

	document.querySelector('head').appendChild(jqueryTag);

	const jqueryLoadInterval = setInterval(() => {
		if (jQuery) {
			$(() => {
				bcpl.branchEmailSwitcher.init($);
			});
			clearInterval(jqueryLoadInterval);
		}
	}, 100);
})();

bcpl.branchEmailSwitcher = (() => {
	let branchData = [];
	const formResultMailFieldSelector = '#_seResultMail';

	const findBranchEmail = (searchTerm) => {
		const foundEmail = branchData.find((branchEmailItem) => {
			if (branchEmailItem && branchEmailItem.myLibrarianEmail && typeof branchEmailItem.myLibrarianEmail === 'string') {
				return branchEmailItem.name.toLowerCase() === searchTerm.toLowerCase();
			}

			return false;
		});

		return foundEmail || '';
	};

	const branchChangeHandler = (changeEvent) => {
		const selectedBranch = changeEvent.target;
		const branchSelectionValue = selectedBranch.value;
		const branchEmailItem = findBranchEmail(branchSelectionValue);

		$(selectedBranch)
			.closest('form')
			.find(formResultMailFieldSelector)
			.attr('value', branchEmailItem.myLibrarianEmail);
	};

	const branchDataSuccessHandler = (branchJson) => {
		branchData = branchJson;
	};

	const branchDataErrorHandler = (error) => {
		console.error(error);
	};

	const init = ($) => {
		$.ajax('/sebin/q/r/branch-amenities.json').then(branchDataSuccessHandler, branchDataErrorHandler);

		$(document).on('change', '#whichBranch', branchChangeHandler);
	};

	return {
		init
	};
})();
