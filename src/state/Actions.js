import * as utils from "../utils/Utils"
import state from "./initialState.json"
import { store } from "./Store";

export const UTILS = utils
export const initialState = utils.cloneData(state)
export const resetState = utils.cloneData(state)

export const LOADER_ACTIVE = "LOADER_ACTIVE"
export const STATE_CHANGE = "STATE_CHANGE"


export const getDispatch = (context) => {
  const globalState = context(store);
  return globalState.dispatch;
};

export const getState = (context) => {
  const globalState = context(store);
  return globalState.state;
};

export const stateChange = (key, value) => {
  return {
    type: STATE_CHANGE,
    key,
    value,
  };
};
export const resetFileImports = (dispatch) => {
  dispatch(stateChange("mappings", { ...initialState.mappings }))
  dispatch(stateChange("mapping", initialState.mapping))
  dispatch(stateChange("model_fields", []))
  dispatch(stateChange("activeStep", initialState.activeStep))
}
 
