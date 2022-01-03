import { AuthManager } from "../auth-manager";
import { AuthUser } from "../types/auth-user";

export const authDisplayName = "ap-auth-display";

class AuthDisplay extends HTMLElement {
	currentUser: AuthUser;
	callbackId: number;
	rendered = false;

	constructor() {
		super();
	}

	connectedCallback() {
		this.rendered = true;

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
		this.innerHTML = "";
		const upperContainer = document.createElement("div");
		upperContainer.classList.add("auth-display-container", "auth-display-upper-container");

		const lowerContainer = document.createElement("div");
		lowerContainer.classList.add("auth-display-container", "auth-display-lower-container");

		if (this.currentUser) {
			this.renderAuthorized(upperContainer, lowerContainer);
		} else {
			this.renderUnauthorized(upperContainer, lowerContainer);
		}

		this.appendChild(upperContainer);
		this.appendChild(lowerContainer);
	}

	renderAuthorized(upperContainer: HTMLDivElement, lowerContainer: HTMLDivElement) {
		const span = document.createElement("span");
		span.classList.add("auth-display-authorized-text");
		span.innerText = `Hello, ${this.currentUser.name}!`;
		upperContainer.appendChild(span);

		const deauthButton = document.createElement("button");
		deauthButton.innerText = "Deauthorize";
		deauthButton.classList.add("auth-display-deauth-button");
		deauthButton.onclick = () => {
			AuthManager.deauthorize();
		};
		lowerContainer.appendChild(deauthButton);
	}

	renderUnauthorized(upperContainer: HTMLDivElement, lowerContainer: HTMLDivElement) {
		const label = document.createElement("label");
		label.innerText = "Authorization Passcode:";
		label.htmlFor = "auth-display-input";
		label.classList.add("auth-display-label");
		upperContainer.appendChild(label);

		const input = document.createElement("input");
		input.id = "auth-display-input";
		upperContainer.appendChild(input);

		const authButton = document.createElement("button");
		authButton.innerText = "Authorize";
		authButton.classList.add("auth-display-auth-button");
		authButton.onclick = () => {
			// Considering putting in an error message
			AuthManager.authorize(input.value);
		};
		lowerContainer.appendChild(authButton);
	}
}

customElements.define(authDisplayName, AuthDisplay);
