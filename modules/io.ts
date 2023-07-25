import { AuthManager } from "./auth-manager";
import { CallbackManager } from "./callback-event";
import { globals, globalsReady } from "./loader";
import { FindPage, FoundPage } from "./types/page";
import { showElement } from "./utilities";

const headerQuery = "#header";
const footerQuery = "#footer";
const contentQuery = "#page-area";

const headerPage = "header";
const footerPage = "footer";
const defaultPage = "home";

const titlePostface = " - Stars Games Reference Doc";
let loadedPage: string;

export enum Parameters {
	pageName = "pageName",
}
export const baseNavigateUrl = `index.html?${Parameters.pageName}=`;
export const pageChangeManager = new CallbackManager<FoundPage>();
export const hashChangeManager = new CallbackManager<string>();

hashChangeManager.RunCallbacks(location.hash);
addEventListener("hashchange", (event) => {
	hashChangeManager.RunCallbacks(location.hash);
});

export async function InitialLoad() {
	let pageName = GetActivePageName();
	loadedPage = pageName;

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
	const pageName = GetActivePageName();

	if (pageName !== loadedPage) {
		loadedPage = pageName;
		LoadIntoContent(pageName);
	}
}

export function InternalNavigate(foundPage: FoundPage, hash?: string) {
	let url = baseNavigateUrl + foundPage.page.name;
	if (hash) {
		url += hash;
	}

	history.pushState(undefined, foundPage.page.title + titlePostface, url);
	OnPopState({} as PopStateEvent);
}

/**
 * Loads the contents of a page into an element. Requires that either the queryString or element values be provided.
 *
 * @param pageName The name of the page to be loaded
 * @param queryString The query string of the element to be loaded into
 * @param element The element to be loaded into
 * @returns A promise pointing to the found element
 */
async function LoadIntoElement(pageName: string, queryString?: string, element?: HTMLElement) {
	const foundPage = FindPage(globals.pageDirectory, pageName);
	const foundElement = queryString ? (document.querySelector(queryString) as HTMLElement) : element;

	if (!foundPage) {
		throw new Error(`Could not find page "${pageName}"`);
	} else if (!foundElement) {
		throw new Error(`Could not find element "${queryString}"`);
	}

	const pageContents = await fetch(foundPage.page.url)
		.then((response) => response.text())
		.catch(() => {
			throw new Error(`Could not find contents of "${pageName}"`);
		});

	foundElement.scrollTop = 0;
	foundElement.innerHTML = pageContents;

	return foundElement;
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

	pageChangeManager.RunCallbacks(foundPage);
	AuthManager.userChanged.AddSingleRunCallback(() => UpdateContentScroll(), true);

	return element;
}

export function UpdateContentScroll() {
	const contents = document.querySelector<HTMLElement>(contentQuery);

	if (location.hash) {
		const hashChild = document.querySelector<HTMLElement>(location.hash);
		showElement(contents, hashChild);
	} else {
		contents.scrollTop = 0;
	}
}
