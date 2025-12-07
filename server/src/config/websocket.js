const WebSocket = require('ws');

let wss;

const initWebSocket = (server) => {
    wss = new WebSocket.Server({ server, path: '/ws/seats/' });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection');

        ws.on('message', (message) => {
            console.log('Received:', message);
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });
};

const broadcastSeatUpdate = (showtimeId, seats) => {
    if (!wss) return;

    const message = JSON.stringify({
        type: 'seat_update',
        showtimeId,
        seats // Array of { row, number, status }
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

module.exports = { initWebSocket, broadcastSeatUpdate };
