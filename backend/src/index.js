import WebSocket, { WebSocketServer } from 'ws';
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

let rooms = {};
let colors = [];

function broadcastToRoom(roomId, username) {
    if (!rooms[roomId]) return; // If the room does not exist, do nothing

    let message = {
        type: "join",
        payload:{
            message: `${username} joined the room`,
            color:username.color,
            username
        }
    };

    Object.values(rooms[roomId]).forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message)); // Correctly stringify the message
        }
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        console.log(`Received: ${data}`);
        let parseData = JSON.parse(data.toString());

        if (parseData.type === "join") {
            console.log("Inside join");

            let username = parseData.payload.clientId;
            let roomId = parseData.payload.roomId;
            let move = parseData.payload.move

            if (!rooms[roomId]) {
                rooms[roomId] = {};
                colors = ['red', 'green', 'blue'];
                rooms[roomId].colors = colors;
            }

            if (Object.keys(rooms[roomId]).length >= 3) {
                ws.send("More than 3 users are not allowed in this room.");
                return;
            }

            if (rooms[roomId][username]) {
                ws.send("User already exists in the room.");
                return;
            }

            rooms[roomId][username] = {
                ws: ws,
                color: rooms[roomId].colors.shift(), // Assign color from the list
            };

            broadcastToRoom(roomId, username);
        }

        if (parseData.type === "move") {
            console.log("Inside move");

            let username = parseData.payload.clientId;
            let roomId = parseData.payload.roomId;
            

            if (!rooms[roomId]) {
                ws.send("Room not found");
                return;
            }

            if (!rooms[roomId][username]) {
                ws.send("User not found in the room");
                return;
            }

            Object.values(rooms[roomId]).forEach((client) => {
                if (client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify({
                        type: "move",
                        payload: {
                            move: parseData.payload.move,
                            color: rooms[roomId][username].color,
                        },
                    }));
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
                rooms[roomId].colors.push(username.color);
                delete rooms[roomId][username];
            });
        }
    });
});

server.listen(8080, () => {
    console.log('Listening on http://localhost:8080');
});

