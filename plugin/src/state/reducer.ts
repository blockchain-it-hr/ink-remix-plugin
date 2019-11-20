import { IState } from './store';
import { updateProjects } from '../utils';

export type IActions = {
    type: 'set_loaded' | 'set_projects' | 'new_project';
    payload?: any;
}

const onCreateProject = (state: IState, action: IActions) => {
    var projects = [...state.projects, action.payload];
    updateProjects(projects);
    return {
        ...state, projects
    }
}

const onSetLoaded = (state: IState, action: IActions) => {
    return { 
        ...state, 
        isLoaded: true 
    };
}

const onSetProjects = (state: IState, action: IActions) => {
    return {
        ...state,
        projects: action.payload
    };
}

export const reducer = (state: IState, action: IActions) => {
    switch (action.type) {
        case 'set_loaded': 
            return onSetLoaded(state, action);
        case 'set_projects':
            return onSetProjects(state, action);
        case 'new_project':
            return onCreateProject(state, action);
        default:
            return state;
    }
}