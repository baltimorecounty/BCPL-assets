/*
 * Creates namespaces safely and conveniently, reusing 
 * existing objects instead of overwriting them.
 */ 
const namespacer = (ns) => {
	let nsArr = ns.split('.'),
		parent = window;
	
	if (!nsArr.length)
		return;

	for (let i = 0; i < nsArr.length; i++) {
		const nsPart = nsArr[i];

		if (typeof parent[nsPart] === 'undefined') {
			parent[nsPart] = {};
		}

		parent = parent[nsPart];
	}
};
