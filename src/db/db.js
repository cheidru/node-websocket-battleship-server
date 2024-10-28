export const playerDB = {
    players: [],
    // counter: 0,
    addPlayer(player, wsID) {
        const newPlayer = {};
        newPlayer.player = JSON.parse(player);
        // newPlayer.index = this.counter++;
        newPlayer.index = wsID;
        this.players.push(newPlayer);
        return newPlayer;  
    }
}

export const roomDB = {
    rooms: [],
    addRoom(player, wsID) {
        const newRoom = {};
        newRoom.roomId = wsID;
        newRoom.roomUsers = [{
            name: player,
            index: 0
        }];
        this.rooms.push(newRoom);
        return newRoom;
    },
    removeRoom(index) {        
        this.rooms[index] = undefined;
    }
}

export const winnerDB = {
    winners: [],
}

export const gameDB = {
    games: [],
    addGame() {
        const newGame = {
            gameId: 0,
            players: []
        }
        this.games.push(newGame);  
    }

}