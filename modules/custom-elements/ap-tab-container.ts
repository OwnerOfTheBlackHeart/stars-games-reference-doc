import { hashChangeManager, UpdateContentScroll } from "../io";

export const tabContainerName = "ap-tab-container";
export const tabElementName = "tab";
export const tabNameAttribute = "name";
export const tabDisplayNameAttribute = "displayname";

export const tabDisplayClass = "tab-display";
export const tabDisplayContainerClass = "tab-display-container";
export const tabActiveClass = "active";
export const tabInactiveClass = "inactive";

interface Tab {
	tab: HTMLElement;
	contents: HTMLElement;
}

// TODO: Add detecting and using hash

class TabContainer extends HTMLElement {
	tabs: Record<string, Tab> = {};
	currentTab: string;
	initialized = false;
	callbackId: number;

	constructor() {
		super();
	}

	connectedCallback() {
		if (this.initialized) {
			Object.keys(this.tabs).forEach((tabName) => {
				if (!this.currentTab || this.currentTab === tabName) {
					this.displayTab(tabName);
				} else {
					this.hideTab(tabName);
				}
			});
		} else {
			const tabsContainer = document.createElement("div");
			tabsContainer.classList.add(tabDisplayContainerClass);
			this.prepend(tabsContainer);

			const tabElements = this.querySelectorAll<HTMLElement>(tabElementName);
			tabElements.forEach((element) => {
				const elementName = element.getAttribute(tabNameAttribute);
				const displayName = element.getAttribute(tabDisplayNameAttribute) ?? elementName;

				const tabDisplay = document.createElement("div");
				tabDisplay.classList.add(tabDisplayClass);
				tabDisplay.innerText = displayName;
				tabDisplay.onclick = () => {
					this.onTabClicked(elementName);
				};

				tabsContainer.appendChild(tabDisplay);

				const tab = { tab: tabDisplay, contents: element } as Tab;
				tab.tab.classList.add(tabInactiveClass);
				tab.contents.classList.add(tabInactiveClass);
				this.tabs[elementName] = tab;

				if (!this.currentTab || this.currentTab === elementName) {
					this.currentTab = elementName;
					this.displayTab(elementName);
				} else {
					this.hideTab(elementName);
				}
			});

			this.initialized = true;
			this.callbackId = hashChangeManager.AddCallback((hash) => this.navigateToHash(hash), true);
		}
	}

	disconnectedCallback() {
		this.currentTab = undefined;
		if (this.callbackId !== undefined) {
			hashChangeManager.RemoveCallback(this.callbackId);
			this.callbackId = undefined;
		}
	}

	onTabClicked(newTab: string) {
		if (newTab !== this.currentTab) {
			Object.keys(this.tabs).forEach((tabName) => {
				this.hideTab(tabName);
			});

			this.displayTab(newTab);
		}
	}

	hideTab(tabName: string) {
		const tab = this.tabs[tabName];

		if (tab) {
			tab.tab.classList.replace(tabActiveClass, tabInactiveClass);
			tab.contents.classList.replace(tabActiveClass, tabInactiveClass);
		} else {
			console.log(`Cannot hide tab. No tab ${tabName} exists`);
		}
	}

	displayTab(tabName: string) {
		const tab = this.tabs[tabName];

		if (tab) {
			this.currentTab = tabName;
			tab.tab.classList.replace(tabInactiveClass, tabActiveClass);
			tab.contents.classList.replace(tabInactiveClass, tabActiveClass);
		} else {
			console.log(`Cannot display tab. No tab ${tabName} exists`);
		}
	}

	navigateToHash(hash: string) {
		console.log(`Navigating to hash ${hash}`);
		if (hash) {
			Object.keys(this.tabs).find((tabName) => {
				if (this.tabs[tabName].contents.querySelector(hash)) {
					this.onTabClicked(tabName);
					UpdateContentScroll();
					return true;
				} else {
					return false;
				}
			});
		}
	}
}

customElements.define(tabContainerName, TabContainer);
