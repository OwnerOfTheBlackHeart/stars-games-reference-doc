import { globals, globalsReady } from "../loader.js";
import { Time } from "../types/time.js";
import { buildCssStylesheetElement, getDescendantProperty, InitializeThemedShadowRoot } from "../utilities.js";
import "./ap-theme-container";
import { ThemeContainer } from "./ap-theme-container";
import { ThemedElement } from "./themed-element.js";

const instructions = Object.freeze(`
To generate a birthday, enter the character's age in the input below and click the 'Generate Birthday' button.
The birthday, along with how long ago it was, will be displayed directly below this sentence.
`);

class BirthdayGeneratorElement extends ThemedElement {
	get currentDateValue() {
		return this.getAttribute("current-date-value");
	}

	set currentDateValue(val) {
		this.setAttribute("current-date-value", val);
	}

	currentDate: Time;
	birthday: Time;
	age: number;

	ageInput: HTMLInputElement;

	constructor() {
		// Always call super first in constructor
		super();
	}

	connectedCallback() {
		this.Render();
	}

	Render() {
		globalsReady.AddSingleRunCallback(() => {
			InitializeThemedShadowRoot(this, "birthday-generator-container");

			this.container.innerHTML = "";
			this.currentDate = getDescendantProperty(globals, this.currentDateValue);

			const bdayHeader = document.createElement("h4");
			bdayHeader.textContent = "Generate Birthday";
			bdayHeader.classList.add("birthday-header");
			this.container.appendChild(bdayHeader);

			const instructionsDisplay = document.createElement("p");
			instructionsDisplay.textContent = instructions;
			instructionsDisplay.classList.add("birthday-instructions");
			this.container.appendChild(instructionsDisplay);

			if (this.birthday) {
				const bdayDisplay = document.createElement("p");
				bdayDisplay.classList.add("birthday-display");
				bdayDisplay.innerText = `You're birthday is ${this.birthday.toString()}. It was ${Time.BuildDiffString(
					this.currentDate,
					this.birthday
				)}.`;
				this.container.appendChild(bdayDisplay);
			}

			const inputContainer = document.createElement("div");
			inputContainer.classList.add("input-container");
			this.container.appendChild(inputContainer);

			this.ageInput = document.createElement("input");
			this.ageInput.type = "number";
			this.ageInput.classList.add("birthday-age-input");
			this.ageInput.autocomplete = "off";
			this.ageInput.setAttribute("data-form-type", "other");

			if (this.age) {
				this.ageInput.value = this.age.toString();
			}

			inputContainer.appendChild(this.ageInput);

			const generateButton = document.createElement("button");
			generateButton.textContent = "Generate Birthday";
			generateButton.onclick = (event) => this.OnGenerateBirthdayClicked(event);
			generateButton.classList.add("birthday-generate-button");
			inputContainer.appendChild(generateButton);

			const resetButton = document.createElement("button");
			resetButton.textContent = "Reset Generator";
			resetButton.onclick = (event) => {
				this.age = 0;
				this.birthday = undefined;
				this.Render();
			};
			resetButton.classList.add("birthday-reset-button");
			inputContainer.appendChild(resetButton);
		}, true);
	}

	OnGenerateBirthdayClicked(event: MouseEvent) {
		const tempAge = this.ageInput.valueAsNumber;
		if (tempAge) {
			this.age = tempAge;
		} else {
			alert("The selected age must be a non-zero number");
			return;
		}
		this.birthday = this.GetRandomBirthday();
		this.Render();
	}

	GetRandomBirthday() {
		const month = Math.floor(Math.random() * 9);
		const day = Math.floor(Math.random() * 28);
		const year = this.currentDate.year - this.age;

		const birthday = new Time(day, month, year);

		if (!this.ValidateBirthday(birthday, this.currentDate, this.age)) {
			if (birthday.year - this.age > 0) {
				birthday.year = birthday.year - 1;
			} else {
				birthday.year = birthday.year + 1;
			}
		}

		return birthday;
	}

	ValidateBirthday(birthday: Time, currentDate: Time, age: number) {
		return currentDate.Subtract(birthday).year === age;
	}
}

customElements.define("ap-birthday-generator", BirthdayGeneratorElement);
