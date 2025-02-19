import WebSocket, { WebSocketServer } from 'ws';
import express from "express"
import http from 'http'
import { log } from 'console';
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

let rooms = {};
let colors = [];

function broadcastToRoom(roomId, username, color, ws) {
    if (!rooms[roomId]) return; // If the room does not exist, do nothing
    let message = {
        type: "join",
        payload: {
            message: `${username} joined the room`,
            color: color,
            username
        }
    };
    console.log("inside broadcastToRoom");

    Object.values(rooms[roomId].users).forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
            if (client.ws === ws) {
                client.ws.send(JSON.stringify(message)); 
            }
        }else {
            console.log(`Skipping message, WebSocket for ${username} is closed.`);
        }
        console.log("out of broadcastToRoom");
        
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        console.log(`Received: ${data}`);
        let parseData = JSON.parse(data.toString());
        let username = parseData.payload.username;
        let roomId = parseData.payload.roomId;

        if (parseData.type === "join") {
            console.log("Inside join");


            if (!rooms[roomId]) {
                rooms[roomId] = { colors: ['red', 'green', 'blue'],users:{} };
                console.log("room created")
            }

            if (Object.keys(rooms[roomId].users).length >= 3) {
                ws.send("More than 3 users are not allowed in this room.");
                return;
            }

            if (rooms[roomId].users[username]) {
                ws.send("User already exists in the room.");
                return;
            }

            let color = rooms[roomId].colors.shift() || 'red';

            rooms[roomId].users[username] = {
                ws: ws,
                color // Assign color from the list
            };
            console.log("rooms.roomId.username:{ws,color} is set");
            console.log(rooms)
            broadcastToRoom(roomId, username, color , ws);
        }

        if (parseData.type === "move") {
            console.log("Inside move");

            if (!rooms[roomId]) {
                console.log("inside room does not exhist")
                ws.send(JSON.stringify({ type: "error", message: "User already exists in the room." }))
                return;
            }

            if (!rooms[roomId].users[username]) {
                console.log("user does not exhist");
                ws.send(JSON.stringify({ type: "error", message: "User already exists in the room." }))
                return;
            }

            Object.values(rooms[roomId].users).forEach((client) => {
                if (client.ws.readyState === WebSocket.OPEN ) {
                    client.ws.send(JSON.stringify({
                        type: "move",
                        payload: {
                            box: parseData.payload.box,
                            color: rooms[roomId].users[username].color,
                        },
                    }));
                }else {
                    console.log(`Skipping message, WebSocket for ${username} is closed.`);
                }
            });

            ws.on('close', () => {
                console.log(`Client ${username} disconnected`);

                if (rooms[roomId] && rooms[roomId].users[username]) {
                    rooms[roomId].colors.push(rooms[roomId].users[username].color); // Return color to pool
                    delete rooms[roomId].users[username]; // Remove user from room
                }

                // If the room is empty, delete it
                if (Object.keys(rooms[roomId].users).length === 0) {
                    delete rooms[roomId];
                }
            });
        }
    });
});

server.listen(8080, () => {
    console.log('Listening on http://localhost:8080');
});

