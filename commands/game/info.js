const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "참여정보",
  },
  async execute(message, args, getCurrentGame, participants) {
    if (!getCurrentGame()) {
      return message.channel.send("현재 생성된 게임이 없습니다. 먼저 게임을 생성하세요.");
    }

    if (participants.length === 0) {
      return message.channel.send("현재 참가자가 없습니다.");
    }

    // 참가자 목록에서 이름 추출
    const participantNames = participants.map(player => player.name);

    const embed = new EmbedBuilder()
      .setTitle("참여자 목록")
      .setDescription(participants.join("\n"))  // 이름 리스트를 표시
      .setColor(0x00ae86)
      .setFooter({ text: `${participants.length}명의 참가자가 있습니다.` }); // 참가자 수 추가

    await message.channel.send({ embeds: [embed] });
  },
};
