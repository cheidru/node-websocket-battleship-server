import { roomDB } from '../db/db.js';

const noRooms = {
  roomId: '',
  roomUsers: [{ name: '', index: 0 }]
}

export const newRegRoomObj = {
  type: 'update_room',
  data: [JSON.stringify(roomDB.rooms.length === 0 ? noRooms : roomDB.rooms)],
  id: 0,
}

export const newRegWinnersObj = {
  type: 'update_winners',
  data:[JSON.stringify({
          name: '',
          wins: 0
      })],
  id: 0,
}