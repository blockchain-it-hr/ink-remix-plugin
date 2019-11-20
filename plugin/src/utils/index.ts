import { IProject } from "../ink/types";
import { remixClient } from "./remix-client";

const LS_INK_PROJECTS = 'ink:projects';

export const synchronizeProjects = async () => {
    var localProjects: IProject[] = JSON.parse(localStorage.getItem(LS_INK_PROJECTS));
    if (!localProjects) {
        return [];
    }
    var projects: IProject[] = [];
    for (let index = 0; index < localProjects.length; index++) {
        const element = localProjects[index];
        try {
            const folder = await remixClient.getFolder(`.ink/${element.projectName}`);
            if (folder) {
                projects.push(element);
            }
        } catch (err) { }
    }
    localStorage.setItem(LS_INK_PROJECTS, JSON.stringify(projects));
    return projects;
}

export const updateProjects = async (projects: IProject[]) => {
    localStorage.setItem(LS_INK_PROJECTS, JSON.stringify(projects));
}