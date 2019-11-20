import { IMessage, MessageHandler } from "./types";

class WebSocketManager {

    connect(url: string, messageHandler: MessageHandler): WebSocket {
        let socket = new WebSocket(url, 'echo-protocol');
        socket.onerror = (error) => {
            console.error('WebSocket Error: ' + error);
        };
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as IMessage;
                messageHandler(data, () => socket.close(1000));
            } catch (err) {
                console.error(err); 
            }
        }
        return socket;
    }
}

export default WebSocketManager;