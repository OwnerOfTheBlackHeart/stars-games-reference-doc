import { CallbackManager } from "./callback-event";
import { globals } from "./loader";
import { FindPage, FoundPage } from "./types/page";
import { showElement } from "./utilities";

const headerQuery = "#header";
const footerQuery = "#footer";
const contentQuery = "#page-area";

const headerPage = "header";
const footerPage = "footer";
const defaultPage = "home";

const titlePostface = " - Stars Games Reference Doc";

export enum Parameters {
	pageName = "pageName",
}
export const baseNavigateUrl = `index.html?${Parameters.pageName}=`;
export const pageChangeManager = new CallbackManager<FoundPage>();

export async function InitialLoad() {
	let pageName = GetActivePageName();

	const [header, footer, content] = await Promise.all([
		LoadIntoElement(headerPage, headerQuery),
		LoadIntoElement(footerPage, footerQuery),
		LoadIntoContent(pageName),
	]);

	return { header, footer, content };
}

/**
 * Retrieves the page name from the current URL query parameters
 */
export function GetActivePageName(): string {
	const params = new URLSearchParams(location.search);
	let pageName = params.get(Parameters.pageName);
	pageName = pageName ? pageName : defaultPage;

	return pageName;
}

/**
 * The callback for the event window.onpopstate.
 * Reloads and rescrolls as necessary for the change in history state.
 *
 * @param ev The pop state event information
 */
export function OnPopState(ev: PopStateEvent) {
	let pageName = GetActivePageName();

	LoadIntoContent(pageName).then(() => UpdateContentScroll());
}

export function InternalNavigate(foundPage: FoundPage, hash?: string) {
	let url = baseNavigateUrl + foundPage.page.name;
	if (hash) {
		url += hash;
	}

	history.pushState(undefined, foundPage.page.title + titlePostface, url);
	OnPopState({} as PopStateEvent);
}

async function LoadIntoElement(pageName: string, queryString: string) {
	const foundPage = FindPage(globals.pageDirectory, pageName);
	const element = document.querySelector(queryString) as HTMLElement;

	if (!foundPage) {
		throw new Error(`Could not find page "${pageName}"`);
	} else if (!element) {
		throw new Error(`Could not find element "${queryString}"`);
	}

	const pageContents = await fetch(foundPage.page.url)
		.then((response) => response.text())
		.catch(() => {
			throw new Error(`Could not find contents of "${pageName}"`);
		});

	element.scrollTop = 0;
	element.innerHTML = pageContents;

	return element;
}

async function LoadIntoContent(pageName: string) {
	const foundPage = FindPage(globals.pageDirectory, pageName);
	const element = document.querySelector(contentQuery) as HTMLElement;

	if (!foundPage) {
		throw new Error(`Could not find page "${pageName}"`);
	} else if (!element) {
		throw new Error(`Could not find element "${contentQuery}"`);
	}

	const pageContents = await fetch(foundPage.page.url)
		.then((response) => response.text())
		.catch(() => {
			throw new Error(`Could not find contents of "${pageName}"`);
		});

	document.title = foundPage.page.title + titlePostface;

	element.scrollTop = 0;
	element.innerHTML = pageContents;

	UpdateContentScroll();
	pageChangeManager.RunCallbacks(foundPage);

	return element;
}

function UpdateContentScroll() {
	const contents = document.querySelector<HTMLElement>(contentQuery);

	if (location.hash) {
		const hashChild = document.querySelector<HTMLElement>(location.hash);
		showElement(contents, hashChild);
	} else {
		contents.scrollTop = 0;
	}
}
