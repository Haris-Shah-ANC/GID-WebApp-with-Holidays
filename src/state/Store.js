import React, { createContext, useReducer } from 'react';
import * as actions from './Actions';
import initialState from "./initialState.json"

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case actions.LOADER_ACTIVE:
                return {
                    ...state,
                    loader: !state.loader
                }
            case actions.STATE_CHANGE:
                return {
                    ...state,
                    [action.key]: action.value
                };
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }
