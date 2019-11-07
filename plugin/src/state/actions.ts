import { IActions } from './reducer';

export const setLoaded = (): IActions => {
    return {
        type: 'set_loaded', 
    }
}