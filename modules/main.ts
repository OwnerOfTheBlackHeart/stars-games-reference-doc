import "./custom-elements/custom-elements";
import { InitialLoad, OnPopState } from "./io";
import { globals } from "./loader";
import { FindPage } from "./types/page";

(window as any).test = (name: string) => {
	console.log(FindPage(globals.pageDirectory, name));
};

InitialLoad().then(() => {
	onpopstate = OnPopState;
});
