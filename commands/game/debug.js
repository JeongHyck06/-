const { EmbedBuilder } = require("discord.js");
const { getServerState } = require('../../state.js');

module.exports = {
  data: {
    name: "디버깅",
  },
  async execute(message, args) {
    const serverState = getServerState(message.guild.id);

    const currentGame = serverState.currentGame ? serverState.currentGame : "없음";
    const participants = serverState.participants.length > 0 
      ? serverState.participants.join("\n")
      : "참가자 없음";

    const teamBLUE = serverState.teamBlue.length > 0 ? serverState.teamBlue.join("\n") : "없음";
    const teamRED = serverState.teamRed.length > 0 ? serverState.teamRed.join("\n") : "없음";

    const embed = new EmbedBuilder()
      .setTitle("디버깅 정보")
      .addFields(
        { name: "현재 게임", value: currentGame, inline: true },
        { name: "참여자 수", value: `${serverState.participants.length}`, inline: true },
        { name: "참가자 목록", value: participants },
        { name: "BLUE 팀", value: teamBLUE, inline: true },
        { name: "RED 팀", value: teamRED, inline: true }
      )
      .setColor(0x00ae86);

    console.log("디버깅 정보:");
    console.log("현재 게임:", currentGame);
    console.log("참가자 목록:", participants);
    console.log("BLUE 팀:", teamBLUE);
    console.log("RED 팀:", teamRED);

    await message.channel.send({ embeds: [embed] });
  },
};
