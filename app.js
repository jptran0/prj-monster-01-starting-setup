/* 
Since we have the same formula for calculating a random number, we outsource it in a separate function (reg JS)
This will not use any Vue controlled data property and will not called inside our HTML code
If we only use it inside the JS code and the above then we can write a JS code
*/
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 != 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // a draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lost
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // a draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Monster lost
        this.winner = "player";
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;

      // we can access methods through the 'this' keyword
      // we want the monster to attack us after we attack it
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 12);
      this.playerHealth -= attackValue;
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;

      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;

      const healValue = getRandomValue(8, 20);

      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }

      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
  },
});

app.mount("#game");

/* 
Notes:
Math.random() gives us a random number between 0 and 1, to set the range you multiply it
between the difference of max - min and then take the Math.floor of it to round it down (so we don't have a decimal)
and then add the minimum again.
*/
