export interface IProject {
    projectId: string,
    projectName: string,
    lib?: string,
    cargo?: string,
    createdAt: string,
}

export interface IProjectStorage {
    [id: string]: IProject
}

export interface IBuildArtifacts {
    wasm: Uint8Array,
    abi: string
}