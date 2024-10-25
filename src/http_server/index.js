import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';

function onSocketError(err) {
    console.error(err);
}

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
    
    // Обрабатываем входящие сообщения
    ws.on('message', function (message) {
        const userMessage = JSON.parse(message)
        console.log('websocket parameters nojson: %s', message);


        const respObjData = {
            name: userMessage.name,
            index: 1,
            error: false,
            errorText: ''
        }

        const respObj = {
            type: "reg",
            data: JSON.stringify(respObjData),
            id: 0,
        }

        ws.send(JSON.stringify(respObj));
        console.log('websocket responce: %s', respObj);


        // if(userMessage.type === 'reg') {
        //     const respObjData = {
        //         name: userMessage.name,
        //         index: 1,
        //         error: true,
        //         errorText: ''
        //     }
    
        //     const respObj = {
        //         type: "reg",
        //         data: JSON.stringify(respObjData),
        //         id: 0,
        //     }
    
        //     ws.send(JSON.stringify(respObj));
        //     console.log('websocket responce: %s', respObj);
    
        //     // Send Update room
        //     const roomUserObj = [ { name: userMessage.name, index: 1 } ]
        //     const roomDataObj = [ {
        //         roomId: 1,
        //         roomUsers: JSON.stringify(roomUserObj),
        //     }];
    
        //     const roomUpdateObj = {
        //         type: 'update_room',
        //         data: JSON.stringify(roomDataObj),
        //         id: 0,
        //     }
    
        //     ws.send(JSON.stringify(roomUpdateObj));
        //     console.log('websocket sent room update: %s', roomUpdateObj);
    
        //     const winnersData = [{
        //         name: userMessage.name,
        //         wins: 0,
        //     }];
    
        //     const updateWinnersObj = {
        //         type: "update_winners",
        //         data: JSON.stringify(winnersData),
        //         id: 0,
        //     }
    
        //     ws.send(JSON.stringify(updateWinnersObj));
        //     console.log('websocket sent winners update: %s', updateWinnersObj);
        // } else if(userMessage.type === 'create_room') {
        //     console.log('Create room');
        // }

    });

    // Обрабатываем закрытие соединения
    ws.on('close', function () {
        console.log('Client disconnected');
    });

    // Обрабатываем ошибки
    ws.on('error', onSocketError);
});
