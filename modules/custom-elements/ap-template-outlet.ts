import { UpdateContentScroll } from "../io";
import { globals, globalsReady } from "../loader";
import { FindPage } from "../types/page";

export const templateOutletName = "ap-template-outlet";

class TemplateOutlet extends HTMLElement {
	get folder() {
		return this.getAttribute("folder");
	}

	set folder(val) {
		this.setAttribute("folder", val);
	}

	get path() {
		return this.getAttribute("path");
	}

	set path(val) {
		this.setAttribute("path", val);
	}

	get page() {
		return this.getAttribute("page");
	}

	set page(val) {
		this.setAttribute("page", val);
	}

	get headerLevel() {
		return Number(this.getAttribute("header-level"));
	}

	set headerLevel(val) {
		this.setAttribute("header-level", val.toString());
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = "";

		if (this.path && this.folder) {
			const folderPath = globals.templateLocations[this.folder];
			const filepath = this.path.includes(".html") ? this.path : this.path + ".html";

			if (folderPath) {
				this.loadFile(`${folderPath}/${filepath}`);
			}
		} else if (this.page) {
			const page = FindPage(globals.pageDirectory, this.page);
			if (page) {
				this.loadFile(page.page.url);
			}
		}
	}

	loadFile(path: string) {
		fetch(path)
			.then((response) => response.text())
			.then((html) => {
				this.innerHTML = this.adjustForHeaderLevel(html);

				if (this.headerLevel) {
					const subTemplates = this.querySelectorAll<TemplateOutlet>(templateOutletName);

					if (subTemplates.length > 0) {
						subTemplates.forEach(
							(subOutlet) =>
								(subOutlet.headerLevel = subOutlet.headerLevel ? subOutlet.headerLevel + this.headerLevel - 1 : this.headerLevel)
						);
					}
				}

				if (location.hash) {
					const element = this.querySelector(location.hash);
					if (element) {
						UpdateContentScroll();
					}
				}
			});
	}

	adjustForHeaderLevel(html: string): string {
		let headerLevelModifier = this.headerLevel;

		if (headerLevelModifier) {
			headerLevelModifier -= 1;
			for (let i = 10; i >= 1; i--) {
				html = html.replaceAll(`<h${i}`, `<h${i + headerLevelModifier}`).replaceAll(`</h${i}>`, `</h${i + headerLevelModifier}>`);
			}

			return html;
		} else {
			return html;
		}
	}
}

globalsReady.AddSingleRunCallback(() => customElements.define(templateOutletName, TemplateOutlet));
