import "./custom-elements/custom-elements";
import "./window-extensions";
import { InitialLoad, OnPopState } from "./io";

InitialLoad().then(() => {
	onpopstate = OnPopState;
});
