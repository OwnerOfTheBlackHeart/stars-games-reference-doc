let highestId = 0;

export class CallbackManager<T> {
	private callbacks: Callback<T>[] = [];
	private lastValue: T;

	AddCallback(callback: (context: T) => void, runImmediately = false): number {
		const id = highestId++;

		this.callbacks.push({ func: callback, id });

		if (runImmediately && this.lastValue !== undefined) {
			callback(this.lastValue);
		}

		return id;
	}

	RemoveCallback(callbackId: number): number {
		this.callbacks = this.callbacks.filter((callback) => callback.id !== callbackId);
		return callbackId;
	}

	RunCallbacks(context: T) {
		this.lastValue = context;
		this.callbacks.forEach((callback) => callback.func(context));
	}
}

export interface Callback<T> {
	func: (context: T) => void;
	id: number;
}
