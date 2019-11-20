import React, { useState } from "react";
import { Console } from './console';

export interface ConsoleOptions {
    maxLength: number
}

export const useConsole = (options: ConsoleOptions) => {
    const [state, setState] = useState([]);

    const push = (log: string) => {
        setState((state) => {
            var logs = state;
            if (logs.length >= options.maxLength) {
                logs.shift();
            }
            return [...logs, log]
        });
    }

    return {
        push,
        Component: <Console logs={state} />
    }
}