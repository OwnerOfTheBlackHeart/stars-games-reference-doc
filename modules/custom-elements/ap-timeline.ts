import { AuthManager } from "../auth-manager";
import { globals, globalsReady } from "../loader";
import { AuthUser } from "../types/auth-user";
import { Time } from "../types/time";
import { CreateTableData, CreateTableHeader, InitializeThemedShadowRoot } from "../utilities";
import "./ap-theme-container";
import { ThemedElement } from "./themed-element";

interface TimeRow {
	time: Time;
	note: string;
	permissions?: string[];
}

export class TimeTable extends ThemedElement {
	get headerTitle() {
		return this.getAttribute("header");
	}

	set headerTitle(val: string) {
		this.setAttribute("header", val);
	}

	get currentDateValue() {
		return this.getAttribute("current-date-value");
	}

	set currentDateValue(val) {
		this.setAttribute("current-date-value", val);
	}

	get disableSort() {
		return this.hasAttribute("disable-sort");
	}

	set disableSort(val) {
		if (val) {
			this.setAttribute("disable-sort", "");
		} else {
			this.removeAttribute("disable-sort");
		}
	}

	rows: TimeRow[] = [];
	hasProcessedEntries = false;
	callbackId: number;
	rendered = false;
	currentUser: AuthUser;

	constructor() {
		// Always call super first in constructor
		super();
	}

	connectedCallback() {
		if (InitializeThemedShadowRoot(this, "time-table-container")) {
			this.callbackId = AuthManager.userChanged.AddCallback((user) => {
				this.currentUser = user;
				if (this.rendered) {
					this.render();
				}
			}, true);
		}

		this.render();
	}

	render() {
		this.rendered = true;

		this.container.innerHTML = "";
		this.getEntries();

		const table = document.createElement("table");
		table.classList.add("alternating-colors");

		if (this.headerTitle) {
			table.appendChild(this.BuildHeaderRow(this.headerTitle));
		}

		for (let row of this.rows) {
			table.appendChild(this.BuildNormalRow(row));
		}

		this.container.appendChild(table);
	}

	BuildHeaderRow(title: string) {
		let node = document.createElement("tr");
		let data = CreateTableHeader(title);

		node.appendChild(data);
		data.setAttribute("colspan", "3");

		return node;
	}

	BuildNormalRow(dateRow: TimeRow) {
		// Setup
		let node = document.createElement("tr");

		// Date Diff String
		if (this.currentDateValue) {
			const diffString = Time.BuildDiffString(globals.dates[this.currentDateValue], dateRow.time);
			const dataNode = CreateTableData(diffString);

			if (diffString.search("ago") >= 0) {
				dataNode.classList.add("previous-date");
			} else if (diffString.search("from now") >= 0) {
				dataNode.classList.add("future-date");
			} else {
				dataNode.classList.add("current-date");
			}

			node.appendChild(dataNode);
		}

		// Date Display
		node.appendChild(CreateTableData(dateRow.time.toString(false)));
		// node.appendChild(CreateTableData(dateRow.time.toString(this.showSeason)));

		// Notes Column
		if (dateRow.note != undefined) {
			node.appendChild(CreateTableData(dateRow.note));
		} else {
			node.appendChild(document.createElement("td"));
		}

		if (dateRow.permissions) {
			node.classList.add("auth-row");

			if (!AuthManager.checkUserPermissions(this.currentUser, dateRow.permissions)) {
				node.style.display = "none";
			}
		}

		return node;
	}

	getEntries() {
		if (!this.hasProcessedEntries) {
			this.hasProcessedEntries = true;

			const entries = this.querySelectorAll("ap-time-entry");
			entries.forEach((entry) =>
				this.rows.push({
					note: entry.innerHTML,
					time: Time.FromInitializer({
						day: Number(entry.getAttribute("day")),
						month: Number(entry.getAttribute("month")),
						year: Number(entry.getAttribute("year")),
					}),
					permissions: entry.getAttribute("permissions")?.split(" "),
				})
			);

			if (this.rows.length > 0) {
				if (!this.disableSort) {
					this.rows.sort((a, b) => Time.Compare(a.time, b.time));
				}
			}
		}
	}
}

globalsReady.AddSingleRunCallback(() => {
	customElements.define("ap-time-table", TimeTable);
}, true);
