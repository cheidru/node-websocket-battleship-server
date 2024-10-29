import { playerDB, roomDB, gameDB } from '../db/db.js';

export function requestHandler(userMessage, reqType, socket) {
  let resp = '';
  let respObjData = {};
  let respObj = {};

  switch(reqType) {
    case 'reg':
      const newPlayer = playerDB.addPlayer(userMessage.data, socket);
      console.log('playerDB player: ', newPlayer);
      console.log('playerDB players: ', playerDB.players);
      respObjData = {
        name: newPlayer.player.name,
        index: newPlayer.index,
        error: false,
        errorText: ''
      }
      console.log('respObjData: ', respObjData);
      respObj = {
          type: 'reg',
          data: JSON.stringify(respObjData),
          id: 0,
      }
      resp = respObj;
      break;

    case 'create_room':
      console.log('socket = ', socket);
      console.log('playerDB.players = ', playerDB.players);
      roomDB.addRoom(playerDB.players[socket].player.name, socket);
      console.log('roomDB rooms: ', roomDB.rooms);
      respObj = {
        type: 'update_room',
        data: [JSON.stringify(roomDB.rooms)],
        id: 0,
      } 
      console.log('created room in roomDB', roomDB.rooms[0].roomUsers);
      resp = respObj;
      break;

    case 'add_user_to_room':
      const roomNo = JSON.parse(userMessage.data).indexRoom;
      if (roomNo == socket) {
        resp = undefined;
        break
      }

      console.log('userMessage.data.indexRoom = ', JSON.parse(userMessage.data).indexRoom);
      respObjData = {        
          idGame: JSON.parse(userMessage.data).indexRoom,  
          idPlayer: 1
      };
      
      respObj = {
        type: 'create_game',
        data: JSON.stringify(respObjData),
        id: 0,
      }
      resp = respObj;
      break;

    case 'single_play':
      
      break;

    case 'add_ships':
      
      
      break;

    case 'attack':
      
      break;

    case 'randomAttack':
      
      break;

    default:
      // return error
  }

  console.log('websocket response: %s', resp);
  return resp;
}




        // ws.send(JSON.stringify(respObj));



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