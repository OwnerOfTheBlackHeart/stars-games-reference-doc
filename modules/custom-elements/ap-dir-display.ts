import { pageChangeManager } from "../io";
import { FoundPage } from "../types/page";
import { navLinkName } from "./ap-nav-link";

export const dirDisplayName = "ap-dir-display";

class DirectoryDisplay extends HTMLElement {
	container: HTMLDivElement;
	currentPage: FoundPage;
	callbackId: number;
	rendered = false;

	constructor() {
		super();
	}

	connectedCallback() {
		this.rendered = true;

		this.callbackId = pageChangeManager.AddCallback((foundPage) => {
			this.currentPage = foundPage;
			if (this.rendered) {
				this.render();
			}
		}, true);

		this.render();
	}

	disconnectedCallback() {
		this.rendered = false;
		pageChangeManager.RemoveCallback(this.callbackId);
	}

	render() {
		this.innerHTML = "";

		this.container = document.createElement("div");
		this.container.classList.add("ap-dir-display-container");
		this.appendChild(this.container);

		if (this.currentPage) {
			this.currentPage.parents.forEach((parent, index) => {
				const parentAnchor = document.createElement("a", { is: navLinkName });
				parentAnchor.setAttribute("href", parent.name);
				parentAnchor.innerText = parent.title;
				parentAnchor.classList.add("ap-dir-display-link");
				this.container.appendChild(parentAnchor);

				const lastIndex = this.currentPage.parents.length - 1;

				if (index < lastIndex) {
					const spacer = document.createElement("span");
					spacer.innerText = ">";
					spacer.classList.add("ap-dir-display-spacer");
					this.container.appendChild(spacer);
				}
			});
		}
	}
}

customElements.define(dirDisplayName, DirectoryDisplay);
