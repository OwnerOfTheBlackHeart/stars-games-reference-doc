/**
 * This site doesn't store any important or personal information and the authorization system is simply for controlling
 * what in-game information players have access to. As such, the auth system is designed with the assumption that the players
 * aren't going to try and access information they shouldn't.
 */
export class AuthUser {
	name: string;
	passphrase: string;
	accessTokens: string[];
}

export const universalAuthorization = "gm";
