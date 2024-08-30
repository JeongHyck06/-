const { EmbedBuilder } = require("discord.js");
const { getServerState } = require('../../state.js');

module.exports = {
  data: {
    name: "참여정보",
  },
  async execute(message, args) {
    const serverState = getServerState(message.guild.id);

    if (!serverState.currentGame) {
      return message.channel.send("현재 생성된 게임이 없습니다. 먼저 게임을 생성하세요.");
    }

    if (serverState.participants.length === 0) {
      return message.channel.send("현재 참가자가 없습니다.");
    }

    const embed = new EmbedBuilder()
      .setTitle("참여자 목록")
      .setDescription(serverState.participants.join("\n"))
      .setColor(0x00ae86)
      .setFooter({ text: `${serverState.participants.length}명의 참가자가 있습니다.` });

    await message.channel.send({ embeds: [embed] });
  },
};
