import { IProject } from "../types";
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
        const folder = await remixClient.getFolder(`.ink/${element.projectName}`);
        if (folder) {
            projects.push(element);
        }
    }
    localStorage.setItem(LS_INK_PROJECTS, JSON.stringify(projects));
    return projects;
}