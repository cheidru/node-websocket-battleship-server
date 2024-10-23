import WebSocket from "ws";

const wsServer = new WebSocket.Server({port: 3000});

wsServer.on('connection', onConnect);

function onConnect(wsClient) {
  console.log('Новый пользователь');
  wsClient.send('Привет');

  wsClient.on('message', function(message) {
      try {
        // сообщение пришло текстом, нужно конвертировать в JSON-формат
        const jsonMessage = JSON.parse(message);
        switch (jsonMessage) {
          case 'ECHO':
            wsClient.send(jsonMessage.data);
            break;
          case 'PING':
            setTimeout(function() {
              wsClient.send('PONG');
            }, 2000);
            break;
          default:
            console.log('Неизвестная команда');
            break;
        }
      } catch (error) {
        console.log('Ошибка', error);
      }
    })
  wsClient.on('close', function() {
      console.log('Пользователь отключился');
  })
}