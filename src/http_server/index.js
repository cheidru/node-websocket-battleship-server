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
            const respObjData = {        
                idGame: userMessage.JSON.parse(data).indexRoom,  
                idPlayer: 0
            };
            
            const respObj = {
              type: 'create_game',
              data: JSON.stringify(respObjData),
              id: 0,
            }
            ws.id = userMessage.data.indexRoom;
            ws.send(JSON.stringify(respObj));
        }

    
    });

    // Обрабатываем закрытие соединения
    ws.on('close', function () {
        console.log('Client disconnected');
    });

    // Обрабатываем ошибки
    ws.on('error', onSocketError);
});
