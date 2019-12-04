import { IConsoleAction, LogType } from "./reducer";

export const onLog = (message: string, type: LogType = 'info'): IConsoleAction => {
    return {
        type: 'log',
        payload: { type, message }
    }
}