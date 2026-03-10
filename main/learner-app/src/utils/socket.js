import { io } from 'socket.io-client';

let socket = null;

export function getSocket(token) {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1500,
        });
    }
    if (!socket.connected) socket.connect();
    return socket;
}

export function disconnectSocket() {
    if (socket) { socket.disconnect(); socket = null; }
}
