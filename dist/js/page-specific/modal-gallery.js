'use strict';

// In addition to jQuery, bootstrap3, https://github.com/ashleydw/lightbox are required for this module
(function modalGallery($) {
	var closeWindowMessage = '<span class="modal-dismiss-text">Close Window</span>';
	var lightboxGallerySelector = '.ekko-lightbox';
	var modalGallerySelector = '.modal-gallery';

	var addCloseMessageText = function addCloseMessageText() {
		var doesCloseTextExist = $('.modal-dismiss-text').length;

		if (!doesCloseTextExist) {
			$(lightboxGallerySelector).find('[data-dismiss="modal"]').find('span').after(closeWindowMessage);
		}
	};

	var addTitleToGalleryItem = function addTitleToGalleryItem($galleryItem, index, galleryImageCount) {
		var galleryCounterMessage = getGalleryCounterMessage(index + 1, galleryImageCount);
		$galleryItem.attr('data-title', galleryCounterMessage);
	};

	var getGalleryCounterMessage = function getGalleryCounterMessage(currentIndex, numberOfTotalImages) {
		return 'Image ' + currentIndex + ' of ' + numberOfTotalImages;
	};

	var handleGalleryItemClick = function handleGalleryItemClick(clickEvent) {
		clickEvent.preventDefault();

		$(clickEvent.currentTarget).ekkoLightbox({
			alwaysShowClose: true,
			onContentLoaded: function onContentLoaded() {
				addCloseMessageText();
			}
		});
	};

	var initializeGallery = function initializeGallery(galleryElm) {
		var $galleryItems = $(galleryElm).find('[data-toggle]');
		var galleryImageCount = $galleryItems.length;

		$galleryItems.toArray().forEach(function (galleryItemElm, index) {
			addTitleToGalleryItem($(galleryItemElm), index, galleryImageCount);
		});
	};

	$(function onDocumentReady() {
		$(modalGallerySelector).toArray().forEach(initializeGallery);
	});

	$(document).on('click', '[data-toggle="lightbox"]', handleGalleryItemClick);
})(jQuery);