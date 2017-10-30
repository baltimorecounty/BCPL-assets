((app) => {
	const locationsService = () => {
		const template = '' +
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

		const get = (externalSuccessCallback, externalErrorCallback) => {
			$.ajax('/mockups/data/branch-amenities.json')
				.done(externalSuccessCallback)
				.fail(externalErrorCallback);
		};

		return {
			template,
			get
		};
	};

	app.factory('locationsService', locationsService);
})(angular.module('filterPageApp'));
