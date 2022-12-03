import { InitializeThemedShadowRoot } from "../utilities";
import "./ap-theme-container";
import { ThemeContainer } from "./ap-theme-container";
import { ThemedElement } from "./themed-element";

export const statBlockName = "ap-stat-block";
enum SubElementNames {
	hitDice = "hit-dice",
	armorClass = "armor-class",
	attacks = "attacks",
	skillBonus = "skill-bonus",
	savingThrow = "saving-throw",
	movement = "movement",
	morale = "morale",
	numberAppearing = "number-appearing",
}

class StatBlock extends ThemedElement {
	constructor() {
		super();
	}

	connectedCallback() {
		InitializeThemedShadowRoot(this, "stat-block-container");

		this.container.innerHTML = "";

		const values = this.getValues();
		const table = document.createElement("table");

		table.appendChild(this.buildRow("Armor Class", values.armorClass, "No. Appearing", values.numberAppearing));
		table.appendChild(this.buildRow("Hit Dice", values.hitDice, "Saving Throw", values.savingThrow));
		table.appendChild(this.buildRow("Attack", values.attacks, "Movement", values.movement));
		table.appendChild(this.buildRow("Skill Bonus", values.skillBonus, "Morale", values.morale));

		this.container.appendChild(table);
	}

	getValues() {
		const hitDiceElement = this.querySelector(SubElementNames.hitDice);
		const armorClassElement = this.querySelector(SubElementNames.armorClass);
		const attacksElement = this.querySelector(SubElementNames.attacks);
		const skillBonusElement = this.querySelector(SubElementNames.skillBonus);
		const savingThrowElement = this.querySelector(SubElementNames.savingThrow);
		const movementElement = this.querySelector(SubElementNames.movement);
		const moraleElement = this.querySelector(SubElementNames.morale);
		const numberAppearingElement = this.querySelector(SubElementNames.numberAppearing);

		return {
			hitDice: hitDiceElement ? hitDiceElement.innerHTML : "",
			armorClass: armorClassElement ? armorClassElement.innerHTML : "",
			attacks: attacksElement ? attacksElement.innerHTML : "",
			skillBonus: skillBonusElement ? skillBonusElement.innerHTML : "",
			savingThrow: savingThrowElement ? savingThrowElement.innerHTML : "",
			movement: movementElement ? movementElement.innerHTML : "",
			morale: moraleElement ? moraleElement.innerHTML : "",
			numberAppearing: numberAppearingElement ? numberAppearingElement.innerHTML : "",
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
}

customElements.define(statBlockName, StatBlock);
