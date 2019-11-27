import { MessageHandler } from './types';
import WebSocketManager from './web-socket-manager';
import { IProject } from '../types';
import { WS_BASE_URL } from '../constants';
import { normalizeProjectName } from '../utils';

class InkService {

    createProject(message: any, handler: MessageHandler) {
        let socket = new WebSocketManager().connect(`${WS_BASE_URL}/new`, handler);
        normalizeProjectName(message);
        socket.onopen = () => socket.send(JSON.stringify(message));
    }

    buildProject(message: IProject, handler: MessageHandler) {
        let socket = new WebSocketManager().connect(`${WS_BASE_URL}/build`, handler);
        socket.onopen = () => socket.send(JSON.stringify(message));
    }
}

const inkService = new InkService();
export default inkService;
