'use strict';

namespacer('bcpl.pageSpecific');

bcpl.pageSpecific.search = function ($, Handlebars, querystringer) {
	var getMaterialTypeData = function getMaterialTypeData(callback) {
		$.get('http://ba224964:3000/data/primaryMaterialType.json').then(function (json) {
			return callback(json);
		});
	};

	var getIconForMaterial = function getIconForMaterial(iconData, materialTypeId) {};

	var searchSuccessHandler = function searchSuccessHandler(data) {
		var materialTypeData = getMaterialTypeData(function (materialTypes) {

			_.map(data, function (record) {
				record.icon = materialTypes[_.findIndex(materialTypes, { id: parseInt(record.PrimaryTypeOfMaterial, 10) })].icon;
			});

			var source = $('#search-results-template').html();
			var template = Handlebars.compile(source);
			var html = template(data);
			$('#search-results').html(html);
		});
	};

	var searchErrorHandler = function searchErrorHandler(err) {
		console.log(err);
	};

	var init = function init() {
		var searchTerms = querystringer.getAsDictionary().q;
		$.get('http://ba224964:1000/api/polaris/search/' + searchTerms).then(searchSuccessHandler, searchErrorHandler);
	};

	return {
		init: init
	};
}(jQuery, Handlebars, bcpl.utility.querystringer);

$(function () {
	bcpl.pageSpecific.search.init();
});