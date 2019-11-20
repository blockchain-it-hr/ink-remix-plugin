import { IProject, IProjectStorage } from '../types';
import { IActions } from './reducer';

export const setLoaded = (): IActions => {
    return {
        type: 'set_loaded', 
    }
}

export const setProjects = (projectStorage: IProjectStorage): IActions => {
    return {
        type: 'set_projects', 
        payload: projectStorage
    }
}

export const newProject = (project: IProject): IActions => {
    return {
        type: 'new_project', 
        payload: project
    }
}