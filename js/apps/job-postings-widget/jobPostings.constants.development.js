((app) => {
	'use strict';

	var constants = {
		templates: {
			table: '/js/apps/job-postings-widget/jobPostings-table.template.html'
		},
		urls: {
			// jobPostings: 'http://staging.bcpl.info/_structured-content/BCPL_Job_Postings?format=json'
			jobPostings: '/js/apps/job-postings-widget/jobPostings.json'
		}
	};

	app.constant('jobPostingsTableWidget.CONSTANTS', constants);
})(angular.module('jobPostingsTableWidget'));
