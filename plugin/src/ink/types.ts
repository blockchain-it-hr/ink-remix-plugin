export type MessageType = 'project' | 'build' | 'stdout' | 'stderr' | 'error';
export type MessageHandler = (message: IMessage, disconnect: () => void) => void;

export interface IMessage {
    type: MessageType,
    payload?: any,
}