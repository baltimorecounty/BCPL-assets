'use strict';

// Used on bcpl_askalibrarian form
// Not using namespacer since I can only load one file on the form.
// Not extracting this to a module since I can only load one file on the form.
// Not using constants since I can only load one file on the form.

var bcpl = window.bcpl || {};

bcpl.pageSpecific = bcpl.pageSpecific || {};

window.addEventListener('load', function () {
	(function ($) {
		var jqueryTag = document.createElement('script');
		if (!$) {
			jqueryTag.src = '/sebin/z/y/jquery.min.js';
			document.querySelector('head').appendChild(jqueryTag);
		}

		var jqueryLoadInterval = setInterval(function () {
			if (jQuery) {
				$(function () {
					bcpl.branchEmailSwitcher.init($);
				});
				clearInterval(jqueryLoadInterval);
			}
		}, 100);
	})(jQuery);

	bcpl.branchEmailSwitcher = function ($) {
		var branchData = [];
		var formResultMailFieldSelector = '#_seResultMail';

		var findBranchEmail = function findBranchEmail(searchTerm) {
			var foundEmail = branchData.find(function (branchEmailItem) {
				if (branchEmailItem && branchEmailItem.myLibrarianEmail && typeof branchEmailItem.myLibrarianEmail === 'string') {
					return branchEmailItem.name.toLowerCase() === searchTerm.toLowerCase();
				}

				return false;
			});

			return foundEmail || '';
		};

		var branchChangeHandler = function branchChangeHandler(changeEvent) {
			var selectedBranch = changeEvent.target;
			var branchSelectionValue = selectedBranch.value;
			var branchEmailItem = findBranchEmail(branchSelectionValue);

			$(selectedBranch).closest('form').find(formResultMailFieldSelector).attr('value', branchEmailItem.myLibrarianEmail);
		};

		var branchDataSuccessHandler = function branchDataSuccessHandler(branchJson) {
			branchData = branchJson;
		};

		var branchDataErrorHandler = function branchDataErrorHandler(error) {
			console.error(error);
		};

		var init = function init($) {
			$.ajax('/sebin/q/r/branch-amenities.json').then(branchDataSuccessHandler, branchDataErrorHandler);

			$(document).on('change', '#whichBranch', branchChangeHandler);
		};

		return {
			init: init
		};
	}(jQuery);
});