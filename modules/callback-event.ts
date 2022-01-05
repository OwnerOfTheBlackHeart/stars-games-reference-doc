let highestId = 0;

export class CallbackManager<T> {
	private callbacks: Callback<T>[] = [];
	private singleRunCallbacks: Callback<T>[] = [];
	private lastValue: T;
	private hasRan = false;
	private isUndefinedValid = false;
	private isFirstRunRequired = false;

	constructor(isUndefinedValid = false, isFirstRunRequired = false, initialValue?: T) {
		this.isUndefinedValid = isUndefinedValid;
		this.isFirstRunRequired = isFirstRunRequired;
		this.lastValue = initialValue;
	}

	AddCallback(callback: (context: T) => void, runImmediately = false): number {
		const id = highestId++;

		this.callbacks.push({ func: callback, id });

		if (runImmediately && (this.isUndefinedValid || this.lastValue !== undefined) && (!this.isFirstRunRequired || this.hasRan)) {
			callback(this.lastValue);
		}

		return id;
	}

	AddSingleRunCallback(callback: (context: T) => void, runImmediately = false) {
		if (runImmediately && (this.isUndefinedValid || this.lastValue !== undefined) && (!this.isFirstRunRequired || this.hasRan)) {
			callback(this.lastValue);
		} else {
			this.singleRunCallbacks.push({ func: callback, id: 0 });
		}
	}

	RemoveCallback(callbackId: number): number {
		this.callbacks = this.callbacks.filter((callback) => callback.id !== callbackId);
		return callbackId;
	}

	RunCallbacks(context: T) {
		this.hasRan = true;
		this.lastValue = context;
		this.callbacks.forEach((callback) => callback.func(context));

		this.singleRunCallbacks.forEach((callback) => callback.func(context));
		this.singleRunCallbacks = [];
	}
}

export interface Callback<T> {
	func: (context: T) => void;
	id: number;
}
