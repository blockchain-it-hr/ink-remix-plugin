export type LogType    = 'info' | 'success' | 'error';
export type ActionType = 'log';

export interface ILog {
    type: LogType,
    message: string
}

export interface IConsoleState {
    logs: ILog[]
}

export interface IConsoleAction {
    type: ActionType,
    payload: ILog
}

export const consoleReducer = (state: IConsoleState, action: IConsoleAction) => {
    switch (action.type) {
        case 'log':
            let logs = state.logs;
            if (logs.length >= 100) {
                logs.shift();
            }
            const { type, message } = action.payload;
            return {
                ...state,
                logs: [...logs, { type, message }]
            };
        default:
            return state;
    }
}