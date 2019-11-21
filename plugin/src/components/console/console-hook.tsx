import React, { useState } from "react";
import { Console, LogType } from './console';

export interface ConsoleOptions {
    maxLength: number
}

export const useConsole = (options: ConsoleOptions) => {
    const [state, setState] = useState([]);

    const push = (log: string, type: LogType = 'info') => {
        setState((state) => {
            var logs = state;
            if (logs.length >= options.maxLength) {
                logs.shift();
            }
            return [...logs, { type, message: log }]
        });
    }

    return {
        push,
        Component: <Console logs={state} />
    }
}