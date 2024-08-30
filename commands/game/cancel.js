const { getServerState } = require('../../state.js');

module.exports = {
  data: {
    name: "게임취소",
  },
  async execute(message, args) {
    const serverState = getServerState(message.guild.id);

    if (!serverState.currentGame) {
      return message.channel.send("취소할 게임 방이 없습니다.");
    }

    serverState.currentGame = null;
    serverState.participants.length = 0;

    await message.channel.send("게임 방이 취소되었습니다.");
  },
};
