import { remixClient } from "./remix-client";
import { IProjectStorage, IProject } from "../types";

const LS_INK_STORAGE_KEY = 'ink:storage';

export const synchronizeProjects = async () => {
    var storage: IProjectStorage = JSON.parse(localStorage.getItem(LS_INK_STORAGE_KEY));
    if (!storage) {
        return {};
    }
    var keys = Object.keys(storage);
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const element = storage[key];
        try {
            await remixClient.getFolder(`.ink/${element.projectName}`);
        } catch (err) { 
            delete storage[key];
        }
    }
    localStorage.setItem(LS_INK_STORAGE_KEY, JSON.stringify(storage));
    return storage;
}

export const updateProjects = (project: IProject): IProjectStorage => {
    var storage: IProjectStorage = JSON.parse(localStorage.getItem(LS_INK_STORAGE_KEY)) || {};
    storage[project.projectId] = project;
    localStorage.setItem(LS_INK_STORAGE_KEY, JSON.stringify(storage));
    return storage;
}

export const base64ToUint8Array = (encoded: string): Uint8Array => {
    var binaryString = window.atob(encoded);
    let length = binaryString.length;

    var array = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
        array[i] = binaryString.charCodeAt(i);
    }
    return array;
}