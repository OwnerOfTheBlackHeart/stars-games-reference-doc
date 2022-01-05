import { CallbackManager } from "./callback-event";
import { AuthUser } from "./types/auth-user";
import { PageDirectory } from "./types/page";

export const globalsReady = new CallbackManager<void>(true, true);

const [directory, users] = await Promise.all([
	fetch("data/pages.json", { cache: "no-store" }).then((response) => response.json() as Promise<PageDirectory>),
	fetch("data/auth.json", { cache: "no-store" }).then((response) => response.json() as Promise<AuthUser[]>),
]);

export const globals = {
	pageDirectory: directory,
	users: users,
};

globalsReady.RunCallbacks();
