// Used on bcpl_askalibrarian form
// Not using namespacer since it doesn't exist in this context.

const bcpl = window.bcpl || {};
bcpl.pageSpecific = bcpl.pageSpecific || {};

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

bcpl.branchEmailSwitcher = (() => {
	let branchData = [];

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
		const branchSelectionValue = changeEvent.target.value;
		const branchEmailItem = findBranchEmail(branchSelectionValue);

		document.getElementById('_seResultMail').value = branchEmailItem.myLibrarianEmail;
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
