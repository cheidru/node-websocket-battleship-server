import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { requestHandler } from '../request_handler/request-handler.js';
import { newRegRoomObj, newRegWinnersObj } from '../utils/reg-resp-pack.js';
import { roomDB } from '../db/db.js';

function onSocketError(err) {
    console.error(err);
}

let wsID = 0;

export const httpServer = http.createServer(function (req, res) {
    console.log('httpServer started');
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

// Создаём WebSocket сервер и привязываем его к HTTP серверу
const wss = new WebSocketServer({ server: httpServer });

// Обрабатываем подключения WebSocket
wss.on('connection', function (ws) {
    console.log('Client connected via WebSocket');
    ws.id = wsID++;

    // Обрабатываем входящие сообщения
    ws.on('message', function (message) {
        console.log('ws.id = ', ws.id);
        const userMessage = JSON.parse(message);        
        console.log('websocket request parameters: %s', message);
        const resp = requestHandler(userMessage, userMessage.type, ws.id);
        if (resp) ws.send(JSON.stringify(resp));


        if(userMessage.type === 'reg') {
            ws.send(JSON.stringify(newRegRoomObj));
            ws.send(JSON.stringify(newRegWinnersObj));
        } else if (userMessage.type === 'add_user_to_room' && resp) {
            const roomNo = JSON.parse(userMessage.data).indexRoom;
            console.log('add_user_to_room roomNo = ', roomNo);
            console.log('wss.clients = ', wss.clients);
            const addRoomOwnerObj = {
                type: 'create_game',
                data: JSON.stringify({
                        idGame: roomNo,
                        idPlayer: 0
                    }),
                id: 0,
            }
            roomDB.removeRoom(roomNo);
            for (let client of wss.clients) {
                if (client.id !== ws.id && client.id == roomNo) {
                    console.log('client.id !== ws.id && client.id == roomNo =', client.id !== ws.id && client.id == roomNo);
                    client.send(JSON.stringify(addRoomOwnerObj));
                } else if (client.id !== ws.id && client.id !== roomNo) {
                    const respObj = {
                        type: 'update_room',
                        data: [JSON.stringify(roomDB.rooms)],
                        id: 0,
                      }
                      client.send(JSON.stringify(respObj));
                }
            } 

        } else if (userMessage.type === 'create_room') {
            for (let client of wss.clients) {
                if (client.id !== ws.id) {
                    client.send(JSON.stringify(resp));
                }
            }
        }
    
    });

    // Обрабатываем закрытие соединения
    ws.on('close', function () {
        console.log('Client disconnected');
    });

    // Обрабатываем ошибки
    ws.on('error', onSocketError);
});
