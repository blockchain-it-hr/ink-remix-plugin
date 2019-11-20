import { IState } from './store';
import { updateProjects } from '../utils';

export type IActions = {
    type: 'set_loaded' | 'set_projects' | 'new_project';
    payload?: any;
}

export const reducer = (state: IState, action: IActions) => {
    switch (action.type) {
        case 'set_loaded': 
            return { 
                ...state, 
                isLoaded: true 
            };
        case 'set_projects':
            return {
                ...state,
                projects: action.payload
            };
        case 'new_project':
            const projects = updateProjects(action.payload);
            return {
                ...state, projects
            }
        default:
            return state;
    }
}