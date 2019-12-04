import React, { createContext, useContext, useReducer } from "react";
import { projectReducer } from './reducer';

const ProjectContext = createContext({} as any);
const initialState = {
    artifacts: null
};

export const ProjectProvider = ({ children }) => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    return (
        <ProjectContext.Provider value={{ state, dispatch }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const ProjectConsumer = ProjectContext.Consumer;
export const useProjectContext = () => useContext(ProjectContext);