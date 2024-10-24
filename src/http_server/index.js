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
        console.log('received: %s', message);
        // Ответ клиенту
        ws.send(`Server received: ${message}`);
    });

    // Обрабатываем закрытие соединения
    ws.on('close', function () {
        console.log('Client disconnected');
    });

    // Обрабатываем ошибки
    ws.on('error', onSocketError);
});