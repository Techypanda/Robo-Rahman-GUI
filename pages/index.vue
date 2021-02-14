<template>
  <v-layout>
    <div
      class="ROBO_CONTROLLER! container"
    >
      <loading
        :can-cancel="false"
        :is-full-page="true"
        :active.sync="moving"
      />
      <v-row>
        <v-col>
          <v-btn
            block
            @click="dapostman(DIRECTIONS.LEFTUP)"
            class="leftUpBtn btn"
            >Left Up</v-btn
          >
        </v-col>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.UP)" class="upBtn btn"
            >Up</v-btn
          >
        </v-col>
        <v-col>
          <v-btn
            block
            @click="dapostman(DIRECTIONS.RIGHTUP)"
            class="rightUpBtn btn"
            >Right Up</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block class="leftBtn btn" @click="dapostman(DIRECTIONS.LEFT)"
            >Left</v-btn
          >
        </v-col>
        <v-col> </v-col>
        <v-col>
          <v-btn block class="rightBtn btn" @click="dapostman(DIRECTIONS.RIGHT)"
            >Right</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            block
            @click="dapostman(DIRECTIONS.LEFTDOWN)"
            class="leftDownBtn btn"
            >Left Down</v-btn
          >
        </v-col>
        <v-col>
          <v-btn block @click="dapostman(DIRECTIONS.DOWN)" class="downBtn btn"
            >Down</v-btn
          >
        </v-col>
        <v-col>
          <v-btn
            block
            @click="dapostman(DIRECTIONS.RIGHTDOWN)"
            class="rightDownBtn"
            >Right Down</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div class="WAITING_ON_CONTROLS!" v-if="0 == 1">
      <v-sheet>
        <h3 class="display">
          You are currently not in control robot is! (DEBUG: Turn =
          {{ this.turn }}) (Consumer == 1 && Producer == 0 )
        </h3>
      </v-sheet>
    </div>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading,
  },
  created() {
    if (process.client) {
      const webSocketConnection = new WebSocket("wss://1i2g5h97o3.execute-api.ap-southeast-2.amazonaws.com/Prod");
      this.connection = webSocketConnection;
      const setMoving = this.setMoving;
      this.connection.onmessage = function (event) {
        const msg = event.data;
        switch (msg) {
          case "Moved":
            setMoving(false);
            break;
        }
      };

      this.connection.onopen = function (event) {
        console.log("Successfully connected to the aws websocket...");
        webSocketConnection.send(`{ "action": "sendmessage", "data": "ready?" }`);
      };

      this.setSocket(webSocketConnection);
    }
  },
  data() {
    return {
      DIRECTIONS: {
        UP: "1",
        RIGHTUP: "2",
        RIGHT: "3",
        RIGHTDOWN: "4",
        DOWN: "5",
        LEFTDOWN: "6",
        LEFT: "7",
        LEFTUP: "8",
      }
    };
  },
  methods: {
    ...mapActions("control", [
      "sendInstruction",
      "sendData",
      "getInitialState",
      "setSocket",
      "setMoving"
    ]),
    dapostman(direction) {
      // this.sendData(true);
      // Robot is consumer, I am the producer.
      // perform a post request.
      // nevermind im using a put request
      // what the fuck
      // why is it crashing?
      this.sock.send(`{ "action": "sendmessage", "data": "${direction}" }`);
      this.setMoving(true);
      // this.sendInstruction(payload);
      /* setTimeout(() => {
        this.check();
      }, 2000); // 2000 ms to send response seems fair? */
    },
  },
  computed: {
    ...mapGetters("control", {
      moving: "getMoving",
      instruction: "getInstructionGetter",
      waiting: "isWaiting",
      sock: "getSocket"
    }),
  },
};
</script>
