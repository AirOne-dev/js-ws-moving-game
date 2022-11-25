const express = require('express');
const app = express()
const expressWs = require('express-ws')(app);

let connections = [];
let players = [];

app.use('/', express.static(__dirname + '/client'));

app.ws('/ws', (ws, req) => {
  // if ws not in connections, add it
  if (connections.indexOf(ws) === -1) {
    connections.push(ws);
    players.push({ 
      name: '', 
      x: 50, 
      y: 50, 
      color: '0x' + Math.floor(Math.random()*16777215).toString(16) 
    });
    sendPlayers();

    ws.on('message', (msg) => {

      // on récupère le joueur qui a envoyé le message et on met à jour sa position
      players[connections.indexOf(ws)] = JSON.parse(msg);

      // on envoie la liste des joueurs à tous les clients
      sendPlayers();
    });
  
    ws.on('close', () => {

      // on supprime le joueur qui s'est déconnecté
      const index = connections.indexOf(ws);

      connections.splice(index, 1);
      players.splice(index, 1);

      // on envoie la liste des joueurs à tous les clients
      sendPlayers();
    });
  }
}); 

const sendPlayers = () => {
  connections.forEach((client) => {
    client.send(JSON.stringify(players.filter((player) => player.name !== '')));
  });
};

app.listen(3000);

