/*
 * Creates namespaces safely and conveniently, reusing
 * existing objects instead of overwriting them.
 */
const namespacer = (ns) => {
	if (!ns) {
		return;
	}

	const nsArr = ns.split('.');
	let parent = window;

	if (!nsArr.length) {
		return;
	}

	for (let i = 0; i < nsArr.length; i += 1) {
		const nsPart = nsArr[i];

		if (typeof parent[nsPart] === 'undefined') {
			parent[nsPart] = {};
		}

		parent = parent[nsPart];
	}
};
