export function showElement(element: HTMLElement, scrolledTo: HTMLElement) {
	if (element && scrolledTo) {
		element.scrollTop = scrolledTo.offsetTop;
		element.scrollLeft = scrolledTo.offsetLeft;
	}
}

export function showId(parentId: string, childId: string) {
	const parent = document.getElementById(parentId);
	const child = document.getElementById(childId);

	showElement(parent, child);
}
