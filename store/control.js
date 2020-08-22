export default {
  namespaced: true,
  state: {
    instruction: null,
    sending: false,
    turn: -999,
  },
  mutations: {
    UPDATE_INSTRUCTION(state, data) {
      state.instruction = data
    },
    UPDATE_SENDING(state, data) {
      state.sending = data
    },
    UPDATE_TURN(state, data) {
      state.turn = data
    }
  },
  actions: {
    sendData({commit}) {
      commit("UPDATE_SENDING", true);
    },
    sendInstruction({ commit }, payload) {
      console.log("Sending Get Request")
      this.$axios
        .$get("/api")
        .then((currentInstruction) => {
          console.log("Recieved Response")
          if (currentInstruction.id != 1) {
            while(true) {
              console.error("Something has seriously gone the fuck wrong. It's meant to be a ID of one!!!!!! AHH")
              // just crash in this instance its fgucked.
            }
          } else {
            if (currentInstruction.turn != 0) {
              console.error("Its not my turn.")
              commit("UPDATE_TURN", 1)
              commit("UPDATE_SENDING", false)
            } else {
              console.log("sending Put request")
              this.$axios.put("/api", payload)
              .then((response) => {
                console.log("recieved response.")
                commit("UPDATE_SENDING", false)
                commit("UPDATE_TURN", 1) // ITS NOW ROBOTS TURN!
              })
              .catch((error) => {
                console.error(error)
              })
            }
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getInitialState({commit}) {
      this.$axios
        .$get("/api")
        .then((currentInstruction) => {
          if (currentInstruction.id != 1) {
            while(true) {
              console.error("Something has seriously gone the fuck wrong. It's meant to be a ID of one!!!!!! AHH")
              // just crash in this instance its fgucked.
            }
          } else {
            commit("UPDATE_TURN", currentInstruction.turn)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  getters: {
    getInstructionGetter(state) {
      return state.instruction;
    },
    getSending(state) {
      return state.sending;
    },
    getWhosTurn(state) {
      return state.turn;
    },
  },
};