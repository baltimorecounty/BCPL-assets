var bcpl = bcpl || {};

bcpl.branchEmailSwitcher = (function branchEmailSwitcher($) {
	var branchEmails = [
		{ name: 'Arbutus', email: 'arsched@bcpl.net' },
		{ name: 'Catonsville', email: 'catonsvi@bcpl.net' },
		{ name: 'Cockeysville', email: 'cockeysv@bcpl.net' },
		{ name: 'Essex', email: 'essex@bcpl.net' },
		{ name: 'Hereford', email: 'hereford@bcpl.net' },
		{ name: 'Lansdowne', email: 'lasched@bcpl.net' },
		{ name: 'Loch Raven', email: 'lochrave@bcpl.net' },
		{ name: 'North Point', email: 'npschedules@bcpl.net' },
		{ name: 'Owings Mills', email: 'owingsmills@bcpl.net' },
		{ name: 'Parkville-Carney', email: 'pasched@bcpl.net' },
		{ name: 'Perry Hall', email: 'pe-libs@bcpl.net' },
		{ name: 'Pikesville', email: 'pikesvil@bcpl.net' },
		{ name: 'Randallstown', email: 'ra-schedules@bcpl.net' },
		{ name: 'Reisterstown', email: 'reisters@bcpl.net' },
		{ name: 'Rosedale', email: 'ro-schedules@bcpl.net' },
		{ name: 'Sollers Point', email: 'sollerspoint@bcpl.net' },
		{ name: 'Towson', email: 'to-schedules@bcpl.net' },
		{ name: 'White Marsh', email: 'wh-schedules@bcpl.net' },
		{ name: 'Woodlawn', email: 'wo-schedules@bcpl.net' }
	];

	var findBranchEmail = function findBranchEmail(searchTerm) {
		var foundEmail = branchEmails.find(function findEmaiItem(branchEmailItem) {
			if (branchEmailItem && branchEmailItem.name && typeof branchEmailItem.name === 'string') {
				return branchEmailItem.name.toLowerCase() === searchTerm.toLowerCase();
			}

			return false;
		});

		return foundEmail || '';
	};

	$(document).on('change', '#whichBranch', function whichBranchChangeEvent(changeEvent) {
		var branchSelectionValue = $(changeEvent.target).val();
		var branchEmailItem = findBranchEmail(branchSelectionValue);

		$('#_seResultMail').val(branchEmailItem.email);
	});
}(jQuery));
