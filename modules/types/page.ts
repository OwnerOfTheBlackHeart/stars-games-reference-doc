export interface Page {
	url: string;
	name: string;
	title?: string;
	external?: boolean;
	theme?: string;
}

export interface PageDirectory {
	baseUrl: string;
	pages: Page[];
	mainPage: string;
	directories?: PageDirectory[];
	theme?: string;
}

export interface FoundPage {
	page: Page;
	parents: Page[];
	theme?: string;
}

export function FindPage(directory: PageDirectory, pageName: string): FoundPage {
	return FindPageInner(directory, pageName, directory.baseUrl);
}

function FindPageInner(directory: PageDirectory, pageName: string, currentPath: string): FoundPage {
	const page = directory.pages.find((page) => page.name === pageName);
	const mainPage = directory.pages.find((page) => page.name === directory.mainPage);
	let foundPage: FoundPage = { page: undefined, parents: [] };

	if (page) {
		foundPage.page = { ...page, url: page.external ? page.url : currentPath + "/" + page.url };

		if (page.theme) {
			foundPage.theme = page.theme;
		}
	} else {
		// Return a "Not Found" state
		if (!directory.directories) {
			return undefined;
		}

		const foundDirectory = directory.directories.find((childDir) => {
			foundPage = FindPageInner(childDir, pageName, currentPath + "/" + childDir.baseUrl);

			return foundPage && foundPage.page;
		});
	}

	if (foundPage) {
		foundPage.parents.unshift({ ...mainPage, url: mainPage.external ? mainPage.url : currentPath + "/" + mainPage.url });

		if (!foundPage.theme) {
			foundPage.theme = directory.theme;
		}
	}

	return foundPage;
}

export function isExternalPage(directory: PageDirectory, pageName: string): boolean {
	const page = isExternalPageInternal(directory, pageName);

	return page.external ? true : false;
}

function isExternalPageInternal(directory: PageDirectory, pageName: string): Page {
	let page = directory.pages.find((page) => page.name === pageName);

	if (page) {
		return page;
	} else {
		// Return a "Not Found" state
		if (!directory.directories) {
			return undefined;
		}

		const foundDirectory = directory.directories.find((childDir) => {
			page = isExternalPageInternal(childDir, pageName);

			return page;
		});
	}

	return page;
}
