import { CallbackManager } from "./callback-event";
import { pageChangeManager } from "./io";

export enum Theme {
	stars = "theme-stars",
	worlds = "theme-worlds",
	test = "theme-test",
}
export const defaultTheme = Theme.stars;

export var CurrentTheme = new CallbackManager<Theme>(false, false, defaultTheme);

CurrentTheme.AddCallback((theme, previous) => {
	const classList = document?.body?.classList;

	if (classList) {
		if (classList.contains(previous)) {
			classList.replace(previous, theme);
		} else {
			classList.add(theme);
		}
	}
});

pageChangeManager.AddCallback((foundPage) => {
	if (foundPage?.theme) {
		CurrentTheme.RunCallbacks(foundPage.theme as Theme);
	} else {
		CurrentTheme.RunCallbacks(defaultTheme);
	}
}, true);
