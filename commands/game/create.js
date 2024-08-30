const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { getServerState } = require('../../state.js');

module.exports = {
  data: {
    name: "게임생성",
  },
  async execute(message, args) {
    const serverState = getServerState(message.guild.id);

    if (serverState.currentGame) {
      return message.channel.send("이미 생성된 게임 방이 있습니다. 새로운 게임 방을 만들 수 없습니다.");
    }

    const joinButton = new ButtonBuilder().setCustomId("join_game").setLabel("참여하기").setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(joinButton);

    serverState.participants.length = 0;

    const newGame = args.join(" ") || "게임";
    serverState.currentGame = newGame;

    await message.channel.send({
      content: `${newGame} 내전이 생성되었습니다! 참여하려면 아래 버튼을 클릭하세요.`,
      components: [row],
    });
  },
};
