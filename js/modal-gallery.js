// In addition to jQuery, bootstrap3, https://github.com/ashleydw/lightbox are required for this module
(function modalGallery($) {
	const closeWindowMessage = '<span class="modal-dismiss-text">Close Window</span>';
	const lightboxGallerySelector = '.ekko-lightbox';
	const modalGallerySelector = '.modal-gallery';

	const addCloseMessageText = () => {
		const doesCloseTextExist = $('.modal-dismiss-text').length;

		if (!doesCloseTextExist) {
			$(lightboxGallerySelector)
				.find('[data-dismiss="modal"]')
				.find('span')
				.after(closeWindowMessage);
		}
	};

	const addTitleToGalleryItem = ($galleryItem, index, galleryImageCount) => {
		const galleryCounterMessage = getGalleryCounterMessage(index + 1, galleryImageCount);
		$galleryItem.attr('data-title', galleryCounterMessage);
	};

	const getGalleryCounterMessage = (currentIndex, numberOfTotalImages) => `Image ${currentIndex} of ${numberOfTotalImages}`;

	const handleGalleryItemClick = (clickEvent) => {
		clickEvent.preventDefault();

		$(clickEvent.currentTarget).ekkoLightbox({
			alwaysShowClose: true,
			onContentLoaded: () => {
				addCloseMessageText();
			}
		});
	};

	const initializeGallery = (galleryElm) => {
		const $galleryItems = $(galleryElm).find('[data-toggle]');
		const galleryImageCount = $galleryItems.length;

		$galleryItems.toArray().forEach((galleryItemElm, index) => {
			addTitleToGalleryItem($(galleryItemElm), index, galleryImageCount);
		});
	};

	$(function onDocumentReady() {
		$(modalGallerySelector)
			.toArray().forEach(initializeGallery);
	});

	$(document).on('click', '[data-toggle="lightbox"]', handleGalleryItemClick);
}(jQuery));

