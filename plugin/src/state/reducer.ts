import { IState } from './Store';

export type IActions = {
    type: 'set_loaded';
    payload?: any;
}

export const reducer = (state: IState, action: IActions) => {
    switch (action.type) {
        case 'set_loaded': 
            return { 
                ...state, 
                isLoaded: true 
            };
        default:
            return state;
    }
}