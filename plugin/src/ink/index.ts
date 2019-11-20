import { MessageHandler } from './types';
import WebSocketManager from './web-socket-manager';
import { IProject } from '../ink/types';

const WS_BASE_URL = 'ws://localhost:65520';

class InkService {

    createProject(message: any, handler: MessageHandler) {
        let socket = new WebSocketManager().connect(`${WS_BASE_URL}/new`, handler);
        socket.onopen = () => socket.send(JSON.stringify(message));
    }

    buildProject(message: IProject, handler: MessageHandler) {
        let socket = new WebSocketManager().connect(`${WS_BASE_URL}/build`, handler);
        socket.onopen = () => socket.send(JSON.stringify(message));
    }
}

const inkService = new InkService();
export default inkService;