import Game from './scenes/game.js';

window.config = {
  width: window.innerWidth,
  height: window.innerHeight,
  mode: Phaser.Scale.FIT,
  type: Phaser.AUTO,
  scene: [Game],
  backgroundColor: '#ffffff',
};

window.playerList = [];
window.me = {
  name: '',
  x: 50,
  y: 50,
  color: '0x' + Math.floor(Math.random()*16777215).toString(16) 
}

document.addEventListener('DOMContentLoaded', () => {
    const $pseudo = document.querySelector('#pseudo');
    const $playButton = document.querySelector('#startGame');
    const $gameForm = document.querySelector('#gameForm');


    // quand on clique sur le bouton "jouer"
    $playButton.addEventListener('click', () => {
        if($pseudo.value !== '') {
          // on cache le formulaire du pseudo
          $gameForm.remove();

          // on défini notre nom par rapport à la valeur du champ
          window.me.name = $pseudo.value

          // On lance le jeu (connexion au websocket, création du jeu)
          startGame();
        } else {
            // on déclenche une erreur si le pseudo est vide
            $gameForm.reportValidity();
        }
    });
});

function startGame() {
  // on se connecte au serveur
  window.webSocket = new WebSocket('ws://localhost:3000/ws');

  // quand on connectéé au serveur, on lance le jeu
  window.webSocket.onopen = () => {
    // on crée le jeu
    window.game = new Phaser.Game(window.config);
  }

  // quand se deconnecte, on affiche un message et on redirige vers la page d'accueil
  window.webSocket.onclose = () => {
    alert('Erreur : déconnecté du serveur !');
    window.location.reload();
  }

  // quand on recoit un message du serveur
  window.webSocket.onmessage = (msg) => {
    // on récupère la liste des joueurs
    window.playerList = JSON.parse(msg.data);
  }
}

/*

On créer une fonction move, accessible dans tout les fichiers js 

move() => vous ne bougez pas, et recuperez juste la position de tout les joueurs
move('UP') => vous allez vers le haut
move('DOWN') => vous allez vers le bas
move('LEFT') => vous allez vers la gauche
move('RIGHT') => vous allez vers la droite

*/
window.move = (action = 'NONE') => {
  const speed = 10;

  switch (action) {
    case 'UP':
        window.me.y -= speed;
      break;

    case 'DOWN':
      window.me.y += speed;
      break;

    case 'LEFT':
      window.me.x -= speed;
      break;

    case 'RIGHT':
      window.me.x += speed;
      break;
  
    default:
      break;
  }

  // on envoie notre position au serveur
  window.webSocket.send(JSON.stringify(window.me));
}