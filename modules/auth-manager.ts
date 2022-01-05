import { CallbackManager } from "./callback-event";
import { globals, globalsReady } from "./loader";
import { AuthUser } from "./types/auth-user";

const currentNameToken = "currentUserName";

/**
 * This site doesn't store any important or personal information and the authorization system is simply for controlling
 * what in-game information players have access to. As such, the auth system is designed with the assumption that the players
 * aren't going to try and access information they shouldn't.
 */
export class AuthManager {
	static userChanged = new CallbackManager<AuthUser>(true, true);

	static checkStoredUser() {
		const userName = localStorage.getItem(currentNameToken);
		const currentUser = globals.users.find((user) => user.name === userName);

		this.userChanged.RunCallbacks(currentUser);
	}

	static authorize(passphrase: string): boolean {
		const foundUser = globals.users.find((user) => user.passphrase === passphrase);

		if (foundUser) {
			this.saveUser(foundUser);
			return true;
		} else {
			return false;
		}
	}

	static deauthorize() {
		this.saveUser(undefined);
	}

	private static saveUser(user: AuthUser) {
		this.userChanged.RunCallbacks(user);
		localStorage.setItem(currentNameToken, user ? user.name : "");
	}
}

globalsReady.AddCallback(() => AuthManager.checkStoredUser(), true);
