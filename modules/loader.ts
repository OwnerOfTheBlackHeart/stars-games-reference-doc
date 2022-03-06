import { CallbackManager } from "./callback-event";
import { AuthUser } from "./types/auth-user";
import { PageDirectory } from "./types/page";
import { DateInitializer, Time } from "./types/time";

export const globalsReady = new CallbackManager<void>(true, true);

const [directory, users, dates] = await Promise.all([
	fetch("data/pages.json", { cache: "no-store" }).then((response) => response.json() as Promise<PageDirectory>),
	fetch("data/auth.json", { cache: "no-store" }).then((response) => response.json() as Promise<AuthUser[]>),
	fetch("data/dates.json", { cache: "no-store" }).then((response) => response.json() as Promise<Record<string, DateInitializer>>),
]);

export const globals = {
	pageDirectory: directory,
	users: users,
	dates: activateDates(dates),
};

globalsReady.RunCallbacks();

function activateDates(dates: Record<string, DateInitializer>): Record<string, Time> {
	const activatedDates = {} as Record<string, Time>;

	for (const key in dates) {
		activatedDates[key] = Time.FromInitializer(dates[key]);
	}

	return activatedDates;
}
