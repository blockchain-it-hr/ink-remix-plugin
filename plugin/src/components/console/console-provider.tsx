import React, { createContext, useContext, useReducer } from "react";
import { consoleReducer } from './reducer';

const ConsoleContext = createContext({} as any);
const initialState = {
    logs: []
};

export const ConsoleProvider = ({ children }) => {
    const [state, dispatch] = useReducer(consoleReducer, initialState);
    return (
        <ConsoleContext.Provider value={{ state, dispatch }}>
            {children}
        </ConsoleContext.Provider>
    );
}

export const ConsoleConsumer = ConsoleContext.Consumer;
export const useConsoleContext = () => useContext(ConsoleContext);