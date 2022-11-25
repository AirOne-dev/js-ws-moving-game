class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.players;
    this.cursors;
    this.playersCircle = [];
    this.playersName = [];
  }

  create() {  
    this.cursors = this.input.keyboard.createCursorKeys();
    this.players = window.playerList;

    // on envoie notre position au serveur pour récupérer les autres joueurs
    window.move();
  }

  update(time, delta) {

    // Si il y a une difference entre les joueurs du serveur et ceux du client
    // (si un joueur s'est connecté, déconnecté, a bougé, etc)
    if(this.players != window.playerList) {

      // on met à jour la liste des joueurs (côté client)
      this.players = window.playerList;

      // on supprime les joueurs affichés (cercle et pseudo)
      this.playersCircle.forEach((circle) => { circle.destroy();});
      this.playersName.forEach((name) => { name.destroy();});

      // on affiche les nouveaux joueurs avec leur position
      this.players.forEach((player) => {
        this.playersCircle.push(this.add.circle(player.x, player.y, 10, player.color));
        this.playersName.push(this.add.text(player.x - (player.name.length * 4), player.y - 27, player.name, { color: 0xffffff }));
      });
    }

    if (this.cursors.left.isDown)
    {
      window.move('LEFT');
    }
    else if (this.cursors.right.isDown)
    {
      window.move('RIGHT');
    }

    if (this.cursors.up.isDown)
    {
      window.move('UP');
    }
    else if (this.cursors.down.isDown)
    {
      window.move('DOWN');
    }
  }
}
  
export default Game;
  