const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "게임생성",
  },
  async execute(message, args, gameList, participants) {
    const joinButton = new ButtonBuilder().setCustomId("join_game").setLabel("참여하기").setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(joinButton);

    participants.length = 0; // 참여자 목록 초기화

    // 새로운 게임을 게임 목록에 추가
    const gameName = args.join(" ") || `게임 ${gameList.length + 1}`;
    gameList.push(gameName);

    await message.channel.send({
      content: `${gameName} 내전이 생성되었습니다! 참여하려면 아래 버튼을 클릭하세요.`,
      components: [row],
    });
  },
};
