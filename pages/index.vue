<template>
  <v-layout>
    <div class="ROBO_CONTROLLER! container" v-if="turn == this.TURNS.PRODUCER_TURN">
      <loading
        :can-cancel="false"
        :is-full-page="true"
        :active.sync="sending"
      />
      <v-row>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.LEFTUP)" class="leftUpBtn btn">Left Up</v-btn>
        </v-col>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.UP)" class="upBtn btn">Up</v-btn>
        </v-col>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.RIGHTUP)" class="rightUpBtn btn">Right Up</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block class="leftBtn btn"  @click="dapostman(DIRECTIONS.LEFT)">Left</v-btn>
        </v-col>
        <v-col>
        </v-col>
        <v-col>
          <v-btn block class="rightBtn btn" @click="dapostman(DIRECTIONS.RIGHT)">Right</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.LEFTDOWN)" class="leftDownBtn btn">Left Down</v-btn>
        </v-col>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.DOWN)" class="downBtn btn">Down</v-btn>
        </v-col>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.RIGHTDOWN)" class="rightDownBtn">Right Down</v-btn>
        </v-col>
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
      // perform a post request.
      // nevermind im using a put request
      // what the fuck
      // why is it crashing?
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
