import { globals, globalsReady } from "../loader.js";
import { getDescendantProperty } from "../utilities.js";

class DisplayGlobalElement extends HTMLElement {
	get propertyPath() {
		return this.getAttribute("property-path");
	}

	set propertyPath(val) {
		this.setAttribute("property-path", val);
	}

	constructor() {
		// Always call super first in constructor
		super();
	}

	connectedCallback() {
		this.Render();
	}

	Render() {
		globalsReady.AddSingleRunCallback(() => {
			const value = getDescendantProperty(globals, this.propertyPath, undefined);

			if (value) {
				this.innerHTML = value.toString();
			} else {
				this.innerHTML = "";
			}
		}, true);
	}
}

customElements.define("ap-display-global", DisplayGlobalElement);
