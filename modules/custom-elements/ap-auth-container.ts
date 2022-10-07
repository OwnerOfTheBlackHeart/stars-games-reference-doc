import { AuthManager } from "../auth-manager";
import { AuthUser, universalAuthorization } from "../types/auth-user";

export const authContainerName = "ap-auth-container";
export enum AuthDisplayType {
	block = "block",
	inline = "inline",
	inlineBlock = "inline-block",
	none = "none",
}

class AuthContainer extends HTMLElement {
	get displayType() {
		if (this.hasAttribute(AuthDisplayType.block)) {
			return AuthDisplayType.block;
		} else if (this.hasAttribute(AuthDisplayType.inline)) {
			return AuthDisplayType.inline;
		} else if (this.hasAttribute(AuthDisplayType.inlineBlock)) {
			return AuthDisplayType.inlineBlock;
		} else if (this.hasAttribute(AuthDisplayType.none)) {
			return AuthDisplayType.none;
		} else {
			this.setAttribute(AuthDisplayType.block, "");
			return AuthDisplayType.block;
		}
	}

	set displayType(val: AuthDisplayType) {
		switch (val) {
			case AuthDisplayType.block:
				this.setAttribute(AuthDisplayType.block, "");
				this.removeAttribute(AuthDisplayType.inline);
				this.removeAttribute(AuthDisplayType.inlineBlock);
				this.removeAttribute(AuthDisplayType.none);
				break;
			case AuthDisplayType.inline:
				this.removeAttribute(AuthDisplayType.block);
				this.setAttribute(AuthDisplayType.inline, "");
				this.removeAttribute(AuthDisplayType.inlineBlock);
				this.removeAttribute(AuthDisplayType.none);
				break;
			case AuthDisplayType.inlineBlock:
				this.removeAttribute(AuthDisplayType.block);
				this.removeAttribute(AuthDisplayType.inline);
				this.setAttribute(AuthDisplayType.inlineBlock, "");
				this.removeAttribute(AuthDisplayType.none);
				break;
			case AuthDisplayType.none:
				this.removeAttribute(AuthDisplayType.block);
				this.removeAttribute(AuthDisplayType.inline);
				this.removeAttribute(AuthDisplayType.inlineBlock);
				this.setAttribute(AuthDisplayType.none, "");
				break;
		}
	}

	accessTokens: string[] = [];
	currentUser: AuthUser;
	callbackId: number;
	rendered = false;

	constructor() {
		super();
	}

	connectedCallback() {
		this.rendered = true;

		const accessTokenString = this.getAttribute("permissions");
		if (accessTokenString) {
			this.accessTokens = accessTokenString.split(" ");
		} else {
			this.accessTokens = [];
		}

		this.callbackId = AuthManager.userChanged.AddCallback((user) => {
			this.currentUser = user;
			if (this.rendered) {
				this.render();
			}
		}, true);
	}

	disconnectedCallback() {
		this.rendered = false;
		AuthManager.userChanged.RemoveCallback(this.callbackId);
	}

	render() {
		if (AuthManager.checkUserPermissions(this.currentUser, this.accessTokens)) {
			this.style.display = this.displayType;
		} else {
			this.style.display = AuthDisplayType.none;
		}
	}
}

customElements.define(authContainerName, AuthContainer);
