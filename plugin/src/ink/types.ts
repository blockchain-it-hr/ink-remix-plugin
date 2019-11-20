export type MessageType = 'project' | 'build' | 'stdout' | 'stderr' | 'error';
export type MessageHandler = (message: IMessage, disconnect: () => void) => void;

export interface IMessage {
    type: MessageType,
    payload?: any,
}

export interface IProject {
    projectId: string,
    projectName: string,
    lib?: string,
    cargo?: string,
    createdAt: string,
}