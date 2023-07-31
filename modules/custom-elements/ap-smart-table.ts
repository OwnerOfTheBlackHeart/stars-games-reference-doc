import { CreateTableData, CreateTableHeader } from "../utilities";

// TODO: Add "separator"
export class SmartTable extends HTMLElement {
	static readonly tagName = "ap-smart-table";
	static readonly rowTagName = "row";
	static readonly footerTagName = "footer";
	static readonly classesTagName = "classes";

	// Headers should be a comma separated list of columns
	get headers() {
		return this.getAttribute("headers");
	}

	set headers(val) {
		this.setAttribute("headers", val);
	}

	columns = [] as string[];
	entryNames = [] as string[];
	rows = [] as Record<string, string>[];
	entryClasses = {} as Record<string, string>;
	footer: string;

	constructor() {
		super();
	}

	connectedCallback() {
		if (this.columns.length === 0) {
			this.initialize();
			console.log({
				columns: this.columns,
				entryNames: this.entryNames,
				rows: this.rows,
				footer: this.footer,
			});
		}

		this.innerHTML = "";
		const table = document.createElement("table");
		table.classList.add("alternating-colors");
		this.appendChild(table);

		const headerRow = document.createElement("tr");
		table.appendChild(headerRow);

		this.columns.forEach((column) => headerRow.appendChild(CreateTableHeader(column)));

		this.rows.forEach((row) => {
			const dataRow = document.createElement("tr");
			table.appendChild(dataRow);

			this.entryNames.forEach((entryName) => dataRow.appendChild(CreateTableData(row[entryName], this.entryClasses[entryName])));
		});

		const footerRow = document.createElement("tr");
		table.appendChild(footerRow);

		const footerData = CreateTableData(this.footer, "smart-table-footer");
		footerData.colSpan = this.columns.length;
		footerRow.appendChild(footerData);
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

		const elements = this.querySelectorAll(SmartTable.rowTagName);
		elements.forEach((row) => {
			const values = {} as Record<string, string>;

			this.entryNames.forEach((entryName) => (values[entryName] = row.querySelector(entryName)?.innerHTML ?? ""));

			this.rows.push(values);
		});

		this.footer = this.querySelector(SmartTable.footerTagName)?.innerHTML;

		const classesElement = this.querySelector(SmartTable.classesTagName);
		this.entryClasses = this.entryNames.reduce<Record<string, string>>((previous, entryName) => {
			previous[entryName] = classesElement?.getAttribute(entryName) ?? "";
			return previous;
		}, {});
	}
}

customElements.define(SmartTable.tagName, SmartTable);
