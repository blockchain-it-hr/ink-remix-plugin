import { IActions } from './reducer';
import { IProject } from '../types';

export const setLoaded = (): IActions => {
    return {
        type: 'set_loaded', 
    }
}

export const setProjects = (projects: IProject[]): IActions => {
    return {
        type: 'set_projects', 
        payload: projects
    }
}

export const newProject = (project: IProject): IActions => {
    return {
        type: 'new_project', 
        payload: project
    }
}