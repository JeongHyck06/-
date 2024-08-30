const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "팀섞기",
  },
  async execute(message, args, getCurrentGame, participants) {
    if (participants.length === 0) {
      return message.channel.send("참가자가 없습니다. 참가자들이 게임에 참가해야 합니다.");
    }

    // 참가자 배열 섞기
    const shuffledParticipants = participants.sort(() => Math.random() - 0.5);

    // 팀 나누기
    const teamSize = Math.ceil(shuffledParticipants.length / 2);
    const teamBLUE = shuffledParticipants.slice(0, teamSize);
    const teamRED = shuffledParticipants.slice(teamSize);

    // 팀 1 임베드 생성
    const teamBlueEmbed = new EmbedBuilder().setTitle("BLUE").setColor(0x1abc9c).setDescription(teamBLUE.join("\n"));

    // 팀 2 임베드 생성
    const teamRedEmbed = new EmbedBuilder().setTitle("RED").setColor(0xe74c3c).setDescription(teamRED.join("\n"));

    // 임베드 메시지 전송
    await message.channel.send({ embeds: [teamBlueEmbed, teamRedEmbed] });
  },
};