const serverStates = {};

module.exports = {
  getServerState: (serverId) => {
    if (!serverStates[serverId]) {
      serverStates[serverId] = {
        participants: [],
        currentGame: null,
        participantMessage: null,
        teamBlue: [],
        teamRed: []
      };
    }
    return serverStates[serverId];
  },
  setServerState: (serverId, state) => {
    serverStates[serverId] = state;
  },
};
