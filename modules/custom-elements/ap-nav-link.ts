import { baseNavigateUrl, InternalNavigate, Parameters } from "../io";
import { globals } from "../loader";
import { FindPage, FoundPage } from "../types/page";

export const navLinkName = "ap-nav-link";

class NavLink extends HTMLAnchorElement {
	foundPage: FoundPage;
	hash: string;

	constructor() {
		super();

		this.onclick = (e) => {
			if (!e.ctrlKey) {
				this.navigate(e);
			}
		};
	}

	connectedCallback() {
		if (!this.foundPage) {
			const givenUrl = this.getAttribute("href");
			let pageName = "";

			if (givenUrl.includes("#")) {
				[pageName, this.hash] = givenUrl.split("#");
			} else {
				pageName = givenUrl;
			}

			this.foundPage = FindPage(globals.pageDirectory, pageName);
		}

		let url = "";

		if (this.foundPage.page.external) {
			url = this.foundPage.page.url;
		} else {
			url = baseNavigateUrl + this.foundPage.page.name;
		}

		if (this.hash) {
			url += this.hash;
		}

		this.setAttribute("href", url);
	}

	navigate(e?: MouseEvent) {
		if (e) {
			e.preventDefault();
		}

		if (this.foundPage.page.external) {
			const url = this.hash ? this.foundPage.page.url + this.hash : this.foundPage.page.url;
			window.open(url, "_blank");
		} else {
			InternalNavigate(this.foundPage, this.hash);
		}
	}
}

customElements.define(navLinkName, NavLink, { extends: "a" });
