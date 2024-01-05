import { CreateTableData, CreateTableHeader } from "../utilities";

export class SmartTable extends HTMLElement {
	static readonly tagName = "ap-smart-table";
	static readonly rowTagName = "row";
	static readonly footerTagName = "footer";
	static readonly classesTagName = "classes";
	static readonly separatorTagName = "separator";

	// Headers should be a comma separated list of columns
	get headers() {
		return this.getAttribute("headers");
	}

	set headers(val) {
		this.setAttribute("headers", val);
	}

	columns = [] as string[];
	entryNames = [] as string[];
	rows = [] as (Record<string, string> | SmartTableSeparator)[];
	entryClasses = {} as Record<string, string>;
	footer: string;
	hasSeparator = false;

	constructor() {
		super();
	}

	connectedCallback() {
		if (this.columns.length === 0) {
			this.initialize();
		}

		this.innerHTML = "";
		const table = document.createElement("table");
		table.classList.add("alternating-colors");
		this.appendChild(table);

		if (!this.hasSeparator) {
			this.createHeaderRow(table);
		}

		this.rows.forEach((row) => {
			const dataRow = document.createElement("tr");
			table.appendChild(dataRow);

			if (row instanceof SmartTableSeparator) {
				dataRow.appendChild(this.createSeparatorRow(row));
				this.createHeaderRow(table);
			} else {
				this.entryNames.forEach((entryName) => dataRow.appendChild(CreateTableData(row[entryName], this.entryClasses[entryName])));
			}
		});

		if (this.footer) {
			const footerRow = document.createElement("tr");
			table.appendChild(footerRow);

			const footerData = CreateTableData(this.footer, "smart-table-footer");
			footerData.colSpan = this.columns.length;
			footerRow.appendChild(footerData);
		}
	}

	initialize() {
		if (this.headers) {
			this.columns = this.headers.split(",");
			this.columns = this.columns.map((column) => column.trim());
			this.entryNames = this.columns.map((column) =>
				column
					.toLowerCase()
					.replaceAll(" ", "-")
					.replaceAll(/['`"\\\/!@#$%%^&\*\(\)\[\]\{\};:.]/g, "")
			);
		}

		const elements = this.querySelectorAll<HTMLElement>(`${SmartTable.rowTagName}, ${SmartTable.separatorTagName}`);
		elements.forEach((row) => {
			if (row.localName === SmartTable.separatorTagName) {
				this.hasSeparator = true;
				this.rows.push(new SmartTableSeparator(row.innerText ?? ""));
			} else {
				const values = {} as Record<string, string>;

				this.entryNames.forEach((entryName) => (values[entryName] = row.querySelector(entryName)?.innerHTML ?? ""));

				this.rows.push(values);
			}
		});

		this.footer = this.querySelector(SmartTable.footerTagName)?.innerHTML;

		const classesElement = this.querySelector(SmartTable.classesTagName);
		this.entryClasses = this.entryNames.reduce<Record<string, string>>((previous, entryName) => {
			previous[entryName] = classesElement?.getAttribute(entryName) ?? "";
			return previous;
		}, {});
	}

	createHeaderRow(table: HTMLTableElement) {
		const headerRow = document.createElement("tr");
		table.appendChild(headerRow);

		this.columns.forEach((column) => headerRow.appendChild(CreateTableHeader(column)));
	}

	createSeparatorRow(separator: SmartTableSeparator): HTMLTableCellElement {
		const element = document.createElement("th");
		element.classList.add("smart-table-separator");
		element.setAttribute("colspan", this.columns.length.toString());
		element.innerText = separator.title;

		return element;
	}
}

export class SmartTableSeparator {
	title: string;

	constructor(title: string) {
		this.title = title;
	}
}

customElements.define(SmartTable.tagName, SmartTable);
