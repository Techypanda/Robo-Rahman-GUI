<template>
  <v-layout>
    <div class="ROBO_CONTROLLER! container" v-if="turn == this.TURNS.PRODUCER_TURN">
      <loading
        :can-cancel="false"
        :is-full-page="true"
        :active.sync="sending"
      />
      <v-row>
        <v-btn @click="dapostman(DIRECTIONS.LEFTUP)" class="col">Left Up</v-btn>
        <v-btn @click="dapostman(DIRECTIONS.UP)" class="col">Up</v-btn>
        <v-btn @click="dapostman(DIRECTIONS.RIGHTUP)" class="col">Right Up</v-btn>
      </v-row>
      <v-row>
        <v-btn @click="dapostman(DIRECTIONS.LEFT)" class="col">Left</v-btn>
        <v-btn class="col">null</v-btn>
        <v-btn @click="dapostman(DIRECTIONS.RIGHT)" class="col">Right</v-btn>
      </v-row>
      <v-row>
        <v-btn @click="dapostman(DIRECTIONS.LEFTDOWN)" class="col">Left Back</v-btn>
        <v-btn @click="dapostman(DIRECTIONS.DOWN)" class="col">Back</v-btn>
        <v-btn @click="dapostman(DIRECTIONS.RIGHTDOWN)" class="col">Right Back</v-btn>
      </v-row>
    </div>
    <div class="WAITING_ON_CONTROLS!" v-else>
      <v-sheet>
        <h3 class="display">
          You are currently not in control robot is! (DEBUG: Turn = {{ this.turn }})
          
          (Consumer == 1 && Producer == 0 )
        </h3>
      </v-sheet>
    </div>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
  /*mounted() { 
    window.addEventListener('keydown', function(ev) {
        const key = ev.key;
        console.log(key)
        switch(key) {
          case 'w':
            this.getInstruction();
            break;
          case 'a':
            this.getInstruction();
            break;
          case 'd':
            this.getInstruction();
            break;
        }
    });
  },*/
  components: {
    Loading
  },
  created() {
    this.check()
  },
  data() {
    return {
      DIRECTIONS: {
        UP: 1,
        RIGHTUP: 2,
        RIGHT: 3,
        RIGHTDOWN: 4,
        DOWN: 5,
        LEFTDOWN: 6,
        LEFT: 7,
        LEFTUP: 8
      },
      TURNS: {
        CONSUMER_TURN: 1,
        PRODUCER_TURN: 0,
      },
    }
  },
  methods: {
    ...mapActions("control", [
      "sendInstruction",
      "sendData",
      "getInitialState",
    ]),
    check() {
      this.getInitialState()
      if (this.turn != this.TURNS.PRODUCER_TURN) {
        setTimeout(() => {
          console.log("Waiting!")
          this.check();
        }, 1000)   
      } 
    },
    dapostman(direction) {
      this.sendData(true);
      // Robot is consumer, I am the producer.
      const ID = 1; // This ID Will never change, because its just a inmemory sql database lol.
      const payload = {
        id: ID,
        direction: direction,
        turn: this.TURNS.CONSUMER_TURN
      };
      this.sendInstruction(payload)
      setTimeout(() => {
        this.check();
      }, 2000) // 2000 ms to send response seems fair?
    }
  },
  computed: {
    ...mapGetters("control", {
      sending: "getSending",
      instruction: "getInstructionGetter",
      turn: "getWhosTurn"
    })
  },
}
</script>
