import { CurrentTheme } from "../themes";

export class ThemeContainer extends HTMLElement {
	static readonly fullKey = "full";

	get full() {
		return this.hasAttribute(ThemeContainer.fullKey);
	}

	set full(val) {
		if (val) {
			this.setAttribute(ThemeContainer.fullKey, "");
		} else {
			this.removeAttribute(ThemeContainer.fullKey);
		}
	}

	callbackId: number;

	constructor() {
		super();
	}

	connectedCallback() {
		if (this.full) {
			this.style.width = "100%";
			this.style.height = "100%";
		} else {
			this.style.width = undefined;
			this.style.height = undefined;
		}

		this.callbackId = CurrentTheme.AddCallback((theme, previous) => {
			if (this.classList.contains(previous)) {
				this.classList.replace(previous, theme);
			} else {
				this.classList.add(theme);
			}
		}, true);
	}

	disconnectedCallback() {
		CurrentTheme.RemoveCallback(this.callbackId);
	}
}

customElements.define("ap-theme-container", ThemeContainer);
