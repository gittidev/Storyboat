const WebSocket = require('ws');
const http = require('http');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const wsServer = new WebSocket.Server({ noServer: true });

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('okay');
});

wsServer.on('connection', (ws, request) => {
    const ip = request.socket.remoteAddress;
    console.log(`New WebSocket connection from IP: ${ip}`);

    setupWSConnection(ws, request);

    ws.on('close', () => {
        console.log(`WebSocket connection closed from IP: ${ip}`);
    });
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
        wsServer.emit('connection', ws, request);
    });
});

server.listen(1234, () => {
    console.log('WebSocket server running on port 1234');
});