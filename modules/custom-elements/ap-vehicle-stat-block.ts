import { buildCssStylesheetElement } from "../utilities";

export const statBlockName = "ap-vehicle-stat-block";
enum SubElementNames {
	speed = "speed",
	travelSpeed = "travel-speed",
	armor = "armor",
	power = "power",
	hitPoints = "hit-points",
	mass = "mass",
	crew = "crew",
	hardpoints = "hardpoints",
	baseFrame = "base-frame",
	fittings = "fittings",
}

class VehicleStatBlock extends HTMLElement {
	container: HTMLDivElement;

	constructor() {
		super();
	}

	connectedCallback() {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: "open" });
			this.shadowRoot.appendChild(buildCssStylesheetElement("elements", true, true));

			this.container = document.createElement("div");
			this.container.classList.add("stat-block-container");
			this.shadowRoot.appendChild(this.container);
		}

		this.container.innerHTML = "";

		const values = this.getValues();
		const table = document.createElement("table");

		table.appendChild(this.buildRow("Speed", values.speed, "Km/H Travel", values.travelSpeed));
		table.appendChild(this.buildRow("Armor", values.armor, "Power", values.power));
		table.appendChild(this.buildRow("Hit Points", values.hitPoints, "Mass", values.mass));
		table.appendChild(this.buildRow("Crew", values.crew, "Hardpoints", values.hardpoints));
		table.appendChild(this.buildDoubleRow("Base Frame", values.baseFrame));
		table.appendChild(this.buildDoubleRow("Fittings", values.fittings));

		this.container.appendChild(table);
	}

	getValues() {
		const speedElement = this.querySelector(SubElementNames.speed);
		const travelSpeedElement = this.querySelector(SubElementNames.travelSpeed);
		const armorElement = this.querySelector(SubElementNames.armor);
		const powerElement = this.querySelector(SubElementNames.power);
		const hitPointsElement = this.querySelector(SubElementNames.hitPoints);
		const massElement = this.querySelector(SubElementNames.mass);
		const crewElement = this.querySelector(SubElementNames.crew);
		const hardpointsElement = this.querySelector(SubElementNames.hardpoints);
		const baseFrameElement = this.querySelector(SubElementNames.baseFrame);
		const fittingsElement = this.querySelector(SubElementNames.fittings);

		return {
			speed: speedElement ? speedElement.innerHTML : "",
			travelSpeed: travelSpeedElement ? travelSpeedElement.innerHTML : "",
			armor: armorElement ? armorElement.innerHTML : "",
			power: powerElement ? powerElement.innerHTML : "",
			hitPoints: hitPointsElement ? hitPointsElement.innerHTML : "",
			mass: massElement ? massElement.innerHTML : "",
			crew: crewElement ? crewElement.innerHTML : "",
			hardpoints: hardpointsElement ? hardpointsElement.innerHTML : "",
			baseFrame: baseFrameElement ? baseFrameElement.innerHTML : "",
			fittings: fittingsElement ? fittingsElement.innerHTML : "",
		};
	}

	buildRow(column1Name: string, column1Value: string, column2Name: string, column2Value: string) {
		const row = document.createElement("tr");
		let header: HTMLTableCellElement;
		let value: HTMLTableCellElement;

		// Column 1
		header = document.createElement("th");
		header.innerText = column1Name;
		row.appendChild(header);

		value = document.createElement("td");
		value.innerHTML = column1Value;
		row.appendChild(value);

		// Column 2
		header = document.createElement("th");
		header.innerText = column2Name;
		row.appendChild(header);

		value = document.createElement("td");
		value.innerHTML = column2Value;
		row.appendChild(value);

		return row;
	}

	buildDoubleRow(name: string, value: string) {
		const row = document.createElement("tr");

		const header = document.createElement("th");
		header.innerText = name;
		row.appendChild(header);

		const data = document.createElement("td");
		data.innerHTML = value;
		data.colSpan = 3;
		row.appendChild(data);

		return row;
	}
}

customElements.define(statBlockName, VehicleStatBlock);
