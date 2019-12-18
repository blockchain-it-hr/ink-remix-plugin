import { MessageHandler } from './types';
import WebSocketManager from './web-socket-manager';
import { IProject } from '../types';
import { WS_BASE_URL } from '../constants';

class InkService {

    createProject(projectName: string, handler: MessageHandler) {
        let socket = new WebSocketManager().connect(`${WS_BASE_URL}/new`, handler);
        socket.onopen = () => socket.send(JSON.stringify({ projectName }));
    }

    buildProject(message: IProject, handler: MessageHandler) {
        let socket = new WebSocketManager().connect(`${WS_BASE_URL}/build`, handler);
        socket.onopen = () => socket.send(JSON.stringify(message));
    }
}

const inkService = new InkService();
export default inkService;
