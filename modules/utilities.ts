// Adding a useful function to Array<T>
declare global {
	interface Array<T> {
		firstElement(): T;
		lastElement(): T;
	}
}

Array.prototype.firstElement = function () {
	return this[0];
};
Array.prototype.lastElement = function () {
	return this[this.length - 1];
};

// Global functions
export function IsGoodString(str: string): boolean {
	return str !== undefined && str !== "";
}

export function CreateTableHeader(data: string, className?: string) {
	let header = document.createElement("th");
	header.innerHTML = data;

	if (IsGoodString(className)) {
		header.className = className;
	}

	return header;
}

export function CreateTableData(data: string, className?: string) {
	let dataElement = document.createElement("td");
	dataElement.innerHTML = data;

	if (IsGoodString(className)) {
		dataElement.className = className;
	}

	return dataElement;
}

export function showElement(element: HTMLElement, scrolledTo: HTMLElement) {
	if (element && scrolledTo) {
		element.scrollTop = scrolledTo.offsetTop - element.offsetTop;
		element.scrollLeft = scrolledTo.offsetLeft - element.offsetLeft;
	}
}

export function showId(parentId: string, childId: string) {
	const parent = document.getElementById(parentId);
	const child = document.getElementById(childId);

	showElement(parent, child);
}

export function buildCssStylesheetElement(path: string, addDotCss = true, addOutPath = false) {
	const href = `${addOutPath ? "out/styles/" : ""}${path}${addDotCss ? ".css" : ""}`;
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.setAttribute("href", href);

	return link;
}

export function numberWithCommas(x: number, places?: number): string {
	if (places === undefined) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		return x.toFixed(places).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

export function getDescendantProperty<T>(parent: any, childPath: string, defaultValue: T = undefined): T {
	if (parent === undefined || parent === null || childPath === undefined || childPath === null) {
		return defaultValue;
	} else if (childPath === "") {
		return parent;
	} else {
		const pathSteps = childPath.split(".");

		if (!pathSteps || pathSteps.length === 0) {
			return parent;
		}

		const found = pathSteps.reduce((previousDescendant, childName) => {
			if (previousDescendant !== undefined) {
				return previousDescendant[childName];
			} else {
				return undefined;
			}
		}, parent);

		if (found === undefined) {
			return defaultValue;
		} else {
			return found;
		}
	}
}

export function setDescendantProperty<T>(parent: T, childPath: string, newValue: any): T {
	if (!childPath) {
		return parent;
	}

	const pathSteps = childPath.split(".");

	if (!pathSteps || pathSteps.length === 0) {
		return parent;
	}

	parent = (parent === undefined ? {} : parent) as any;
	const maxIndex = pathSteps.length - 1;
	pathSteps.reduce((previousDescendant: any, childName, index) => {
		if (index === maxIndex) {
			previousDescendant[childName] = newValue;
			return previousDescendant[childName];
		} else {
			let next = previousDescendant[childName];
			if (next === undefined || next === null) {
				next = previousDescendant[childName] = {};
			}
			return next;
		}
	}, parent);

	return parent;
}
