const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "나가기",
  },
  async execute(interaction, args, getCurrentGame, participants, setCurrentGame, participantMessage) {
    const displayName = interaction.member.displayName;

    if (!getCurrentGame()) {
      return interaction.reply({ content: "현재 참여 중인 게임이 없습니다.", ephemeral: true });
    }

    const index = participants.indexOf(displayName);
    if (index > -1) {
      participants.splice(index, 1); // 참가자 목록에서 사용자 제거

      const embed = new EmbedBuilder()
        .setTitle("참여자 목록")
        .setDescription(participants.join("\n") || "참가자가 없습니다.")
        .setColor(0x00ae86);

      // 이전 임베드를 삭제하고 새로운 임베드를 보냄
      if (participantMessage) {
        await participantMessage.delete(); // 이전 임베드 삭제
      }

      // 새로운 임베드 메시지를 저장
      const newMessage = await interaction.channel.send({ embeds: [embed] });
      setCurrentGame(newMessage);

      await interaction.reply({ content: `${displayName}님이 내전에서 나갔습니다!`, ephemeral: true });
    } else {
      await interaction.reply({ content: "참가자 목록에 당신이 없습니다.", ephemeral: true });
    }
  },
};
