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
