((app) => {
	'use strict';

	const jobPostingsService = (CONSTANTS, $http, $q) => {
		const JobPosting = (model) => {
			return {
				jobTitle: model.jobTitle || '',
				location: model.location || '',
				employmentType: model.employmentType || '',
				closingDate: model.closingDate || 'Open Until Filled'
			};
		};

		const formatContents = (data) => {
			return data.map((item) => {
				const jobTitle = item._title.VALUE; // eslint-disable-line no-underscore-dangle
				const location = item.Location.VALUE;
				const employmentType = item.Employment_Type.VALUE;
				const closingDate = item._endDate.VALUE; // eslint-disable-line no-underscore-dangle

				return new JobPosting({
					jobTitle,
					location,
					employmentType,
					closingDate
				});
			});
		};

		const getJobPostings = () => {
			return $q((resolve, reject) => {
				$http.get(CONSTANTS.urls.jobPostings)
					.then((response) => {
						if (response.data) {
							const formattedContents = formatContents(response.data.CONTENTS);
							resolve({
								data: formattedContents
							});
						} else {
							reject(response);
						}
					}, reject);
			});
		};

		return {
			getJobPostings
		};
	};

	jobPostingsService.$inject = ['jobPostingsTableWidget.CONSTANTS', '$http', '$q'];

	app.factory('jobPostingsTableWidget.jobPostingsService', jobPostingsService);
})(angular.module('jobPostingsTableWidget'));
