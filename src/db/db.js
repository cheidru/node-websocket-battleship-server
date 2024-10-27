export const playerDB = {
    players: [],
    counter: 0,
    addPlayer(player) {
        const newPlayer = {};
        newPlayer.player = JSON.parse(player);
        newPlayer.index = this.counter++;
        this.players.push(newPlayer);
        return newPlayer;  
    }
}

export const roomDB = {
    rooms: [],
    counter: 0,
    addRoom(player) {
        const newRoom = {};
        newRoom.roomId = this.counter++;
        newRoom.roomUsers = [{
            name: player,
            index: 0
        }];
        this.rooms.push(newRoom);
        return newRoom;
    },
    removeRoom(index) {        
        rooms[index] = undefined;
    }
}

export const winnerDB = {
    winners: [],
}