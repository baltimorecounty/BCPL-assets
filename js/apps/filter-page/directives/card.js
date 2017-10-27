(() => {
	'use strict';

	const template = '' +
		'<div class="card">' +
		'	<div class="row">' +
		'		<div class="col-sm-12 branch-address">' +
		'			<h4>' +
		'				<a href="#">{{card.name}}</a>' +
		'			</h4>' +
		'			<p>{{card.description}}</p>' +
		'			<div class="tags">Categories:' +
		'				<ul class="tag-list">' +
		'					<li ng-repeat="attribute in card.attributes"><button>{{attribute}}</button></li>' +
		'				</ul>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'</div>';

	const cardDirective = () => {
		const directive = {
			restrict: 'E',
			template: template
		};

		return directive;
	};

	cardDirective.$inject = [];

	angular
		.module('filterPageApp')
		.directive('card', cardDirective);
})();
