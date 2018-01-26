((app) => {
	'use strict';

	const JobPostingsCtrl = function JobPostingsCtrl($scope, constants, jobPostingsService) {
		const vm = this;

		jobPostingsService.getJobPostings()
			.then(handleRequestSuccess)
			.catch(handleRequestError);

		const handleRequestSuccess = (response) => {
			vm.jobPostings = response.data;
		};

		const handleRequestError = (error) => {
			vm.errorMessage = error;
			vm.friendlyErrorMessage = 'We had a problem getting job postings. Please try again later.';
		};
	};


	JobPostingsCtrl.$inject = ['$scope', 'jobPostingsTableWidget.CONSTANTS', 'jobPostingsTableWidget.jobPostingsService'];

	app.controller('jobPostingsTableWidget.JobPostingsCtrl', JobPostingsCtrl);
})(angular.module('jobPostingsTableWidget'));
