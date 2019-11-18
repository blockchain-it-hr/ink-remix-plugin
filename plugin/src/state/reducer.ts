import { IState } from './store';

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
            var projects = state.projects;
            projects.push(action.payload);
            return {
                ...state, projects
            }
        default:
            return state;
    }
}