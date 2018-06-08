(function($) {
	const imageContainerSelector = '.pull-image-right, .pull-image-left';

	const addMaxWidth = (index, value) => {
		const $imageContainer = $(value);
		const imgElm = $imageContainer.find('img')[0];

		if (!imgElm) return;

		$imageContainer
			.css('max-width', imgElm.naturalWidth + 'px');
	};

	$(document).ready(function() {
		const $imgContainer = $(imageContainerSelector);

		$.each($imgContainer, addMaxWidth);
	});
})(jQuery)