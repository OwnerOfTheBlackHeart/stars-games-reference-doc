import { PageDirectory } from "./types/page";

export const globals = {
	pageDirectory: undefined as PageDirectory,
};

await LoadGlobals();

async function LoadGlobals() {
	const [directory] = await Promise.all([
		fetch("data/pages.json", { cache: "no-store" }).then((response) => response.json() as Promise<PageDirectory>),
	]);

	globals.pageDirectory = directory;
}
