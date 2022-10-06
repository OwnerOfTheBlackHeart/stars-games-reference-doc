let highestId = 0;

export class CallbackManager<T> {
	private callbacks: Callback<T>[] = [];
	private singleRunCallbacks: Callback<T>[] = [];
	private previousValue: T;
	private hasRan = false;
	private isUndefinedValid = false;
	private isFirstRunRequired = false;

	constructor(isUndefinedValid = false, isFirstRunRequired = false, initialValue?: T) {
		this.isUndefinedValid = isUndefinedValid;
		this.isFirstRunRequired = isFirstRunRequired;
		this.previousValue = initialValue;
	}

	AddCallback(callback: (newValue: T, previousValue: T) => void, runImmediately = false): number {
		const id = highestId++;

		this.callbacks.push({ func: callback, id });

		if (runImmediately && (this.isUndefinedValid || this.previousValue !== undefined) && (!this.isFirstRunRequired || this.hasRan)) {
			callback(this.previousValue, this.previousValue);
		}

		return id;
	}

	AddSingleRunCallback(callback: (newValue: T, previousValue: T) => void, runImmediately = false) {
		if (runImmediately && (this.isUndefinedValid || this.previousValue !== undefined) && (!this.isFirstRunRequired || this.hasRan)) {
			callback(this.previousValue, this.previousValue);
		} else {
			this.singleRunCallbacks.push({ func: callback, id: 0 });
		}
	}

	RemoveCallback(callbackId: number): number {
		this.callbacks = this.callbacks.filter((callback) => callback.id !== callbackId);
		return callbackId;
	}

	RunCallbacks(newValue: T) {
		this.hasRan = true;
		this.callbacks.forEach((callback) => callback.func(newValue, this.previousValue));

		this.singleRunCallbacks.forEach((callback) => callback.func(newValue, this.previousValue));
		this.singleRunCallbacks = [];

		this.previousValue = newValue;
	}
}

export interface Callback<T> {
	func: (newValue: T, previousValue: T) => void;
	id: number;
}
