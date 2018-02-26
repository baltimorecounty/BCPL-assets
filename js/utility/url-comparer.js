namespacer('bcpl.utility');

bcpl.utility.urlComparer = ((constants) => {
	const hrefEndingTypes = {
		fileName: 0,
		slash: 1,
		folderName: 2
	};

	const getEndingType = (href) => {
		const hrefParts = href.split('/');
		const lastHrefPart = hrefParts[hrefParts.length - 1];
		const lastPeriodIndex = lastHrefPart.lastIndexOf('.');
		const lastSlashIndex = lastHrefPart.lastIndexOf('/');

		if (lastHrefPart === '') {
			return hrefEndingTypes.slash;
		}

		if (lastPeriodIndex > -1 && lastPeriodIndex > lastSlashIndex) {
			return hrefEndingTypes.fileName;
		}

		return hrefEndingTypes.folderName;
	};

	const isSamePage = (navHref, locationHref) => {
		const navLinkEndingType = getEndingType(navHref);
		const locationEndingType = getEndingType(locationHref);

		if (navLinkEndingType === locationEndingType) {
			return locationHref.endsWith(navHref);
		}

		switch (locationEndingType) {
		case hrefEndingTypes.folderName:
			return removeFilenameAndTrailingSlash(navHref, navLinkEndingType).endsWith(locationHref);
		case hrefEndingTypes.slash:
			return `${removeFilenameAndTrailingSlash(navHref, navLinkEndingType)}/`.endsWith(locationHref);
		default:
			return navHref.endsWith(locationHref);
		}
	};

	const removeFilenameAndTrailingSlash = (url, endingType) => {
		const urlParts = url.split('/');
		const urlPartsLength = urlParts.length;
		const isIndexPage = urlParts[urlParts.length - 1].toLowerCase() === constants.defaultDocument;

		if (endingType === hrefEndingTypes.folderName) {
			return url;
		}

		if (urlPartsLength > 0 && endingType === hrefEndingTypes.fileName && !isIndexPage) {
			return url;
		}

		switch (urlPartsLength) {
		case 0:
			return ''; // this should never happen, but let's compensate just in case
		case 1:
			return urlParts[0]; // this means we just have a filename or foldername
		default:
			return Array.prototype.join.call(urlParts.slice(0, urlParts.length - 1), '/'); // removes filename and trailing slash
		}
	};

	return {
		isSamePage,
		getEndingType,
		removeFilenameAndTrailingSlash,
		hrefEndingTypes
	};
})(bcpl.constants);
