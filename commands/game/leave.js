const { getServerState } = require('../../state.js');

module.exports = {
  data: {
    name: "나가기",
  },
  async execute(message, args) {
    const serverState = getServerState(message.guild.id);
    const displayName = message.member.displayName;

    if (!serverState.currentGame) {
      return message.channel.send("현재 생성된 게임이 없습니다.");
    }

    const index = serverState.participants.indexOf(displayName);
    if (index !== -1) {
        serverState.participants.splice(index, 1);
        await message.channel.send(`${displayName}님이 게임에서 나갔습니다.`);
    } else {
        await message.channel.send(`${displayName}님은 게임에 참가하지 않았습니다.`);
    }
  },
};
