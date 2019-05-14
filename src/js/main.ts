import State from "./State";
import initializeUI from "./ui";
import initializeScene from "./scene";

const state = new State();
initializeUI(state);
initializeScene(state);
