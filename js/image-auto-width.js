(function($) {
	$(document).ready(function() {
		$('.pull-image-right, .pull-image-left').each(function() {
			var $imageContainer = $(this);
			var imgElm = $imageContainer.find('img')[0];

			if (!imgElm) return;

			$imageContainer
				.css('max-width', imgElm.naturalWidth + 'px');
		});
	});
})(jQuery)