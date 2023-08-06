import { StringToObject } from "./utilities";

declare global {
	interface Window {
		ProcessToRow: (columns: string, data: string) => string;
	}
}

export function ProcessToRow(columnString: string, data: string): string {
	const element = document.createElement("div");
	const columns = columnString.split(",").map((column) =>
		column
			.trim()
			.toLowerCase()
			.replaceAll(" ", "-")
			.replaceAll(/['`"\\\/!@#$%%^&\*\(\)\[\]\{\};:.]/g, "")
	);
	const rows = StringToObject<string[][]>(data);

	rows.forEach((rowElements) => {
		const row = document.createElement("row");
		columns.forEach((column, index) => {
			const col = document.createElement(column);
			col.innerHTML = rowElements[index];

			row.appendChild(col);
		});
		element.appendChild(row);
	});

	return element.innerHTML.replaceAll(">", ">\n");
}
window.ProcessToRow = ProcessToRow;
