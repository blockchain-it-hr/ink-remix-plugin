import React, { useState } from "react";
import { Console } from './console';

export interface ConsoleOptions {
    maxLength: number
}

export const useConsole = (options: ConsoleOptions) => {
    const [state, setState] = useState([]);

    const push = (log: string) => {
        var logs = state;
        if (logs.length >= options.maxLength) {
            logs.shift();
        }
        setState([...logs, log]);
    }

    return {
        push,
        Component: <Console logs={state} />
    }
}