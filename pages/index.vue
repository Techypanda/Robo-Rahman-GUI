<template>
  <v-layout>
    <div class="ROBO_CONTROLLER!" v-if="turn == this.TURNS.PRODUCER_TURN">
      <loading
        :can-cancel="false"
        :is-full-page="true"
        :active.sync="sending"
      />
      <v-btn @click="dapostman(DIRECTIONS.UP)" v-on:keyup.enter="dapostman(DIRECTIONS.UP)"><v-icon>up</v-icon></v-btn>
      <v-btn @click="dapostman(DIRECTIONS.LEFT)"><v-icon>left</v-icon></v-btn>
      <v-btn @click="dapostman(DIRECTIONS.RIGHT)"><v-icon>right</v-icon></v-btn>
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
        LEFT: 1,
        UP: 2,
        RIGHT: 3,
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
