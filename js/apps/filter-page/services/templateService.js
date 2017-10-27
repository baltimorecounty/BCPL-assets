(() => {
	'use strict';

	const templateService = () => {
		const databasesTemplate = '' +
			'<div class="card">' +
			'	<div class="row">' +
			'		<div class="col-sm-12 branch-address">' +
			'			<h4>' +
			'				<a href="#">{{cardData.name}}</a>' +
			'			</h4>' +
			'			<p>{{cardData.description}}</p>' +
			'			<div class="tags">Categories:' +
			'				<ul class="tag-list">' +
			'					<tag tag-data="cardData.attributes" active-filters="activeFilters" filter-handler="filterHandler"></tag>' +
			'				</ul>' +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>';

		const locationsTemplate = '' +
			'<div class="card">' +
			'	<div class="row">' +
			'		<div class="col-sm-3 branch-name">' +
			'			<div class="branch-photo" style="background: url(/dist/images/branches/{{cardData.photo}})">' +
			'				<a href="#">{{cardData.name}}' +
			'					<i class="fa fa-caret-right" aria-hidden="true"></i>' +
			'				</a>' +
			'			</div>' +
			'		</div>' +
			'		<div class="col-sm-4 branch-address">' +
			'			<h4>{{cardData.name}} Branch</h4>' +
			'			<address>' +
			'				{{cardData.address}}' +
			'				<br/> {{cardData.city}}, MD {{cardData.zip}}' +
			'			</address>' +
			'		</div>' +
			'		<div class="col-sm-5 branch-email-phone">' +
			'			<div class="branch-email-phone-wrapper">' +
			'				<a href="mailto:{{cardData.email}}" class="branch-email">' +
			'					<i class="fa fa-envelope" aria-hidden="true"></i> Contact {{cardData.name}}' +
			'				</a>' +
			'				<a href="tel:{{cardData.phone}}" class="branch-phone">' +
			'					<i class="fa fa-phone" aria-hidden="true"></i> {{cardData.phone}}' +
			'				</a>' +
			'			</div>		' +
			'		</div>' +
			'	</div>' +
			'	<div class="row">' +
			'		<div class="col-xs-12">' +
			'			<hr />' +
			'		</div>' +
			'	</div>' +
			'	<div class="row">' +
			'		<div class="col-xs-12">' +
			'			<div class="tags">' +
			'				<ul class="tag-list">' +
			'					<tag tag-data="cardData.attributes" active-filters="activeFilters" filter-handler="filterHandler"></tag>' +
			'				</ul>' +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>';

		const get = (templateName) => {
			switch (templateName) {
			case 'databases':
				return databasesTemplate;
			case 'locations':
				return locationsTemplate;
			default:
				return '';
			}
		};

		return {
			get
		};
	};

	templateService.$inject = [];

	angular
		.module('filterPageApp')
		.factory('templateService', templateService);
})();
