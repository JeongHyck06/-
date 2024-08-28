const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "게임생성",
  },
  async execute(message, args, getCurrentGame, participants, setCurrentGame) {
    if (getCurrentGame()) {
      return message.channel.send("이미 생성된 게임 방이 있습니다. 새로운 게임 방을 만들 수 없습니다.");
    }

    const joinButton = new ButtonBuilder().setCustomId("join_game").setLabel("참여하기").setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(joinButton);

    participants.length = 0; // 참여자 목록 초기화

    // 새로운 게임을 생성하고 currentGame 변수에 저장
    const newGame = args.join(" ") || "게임";
    setCurrentGame(newGame); // currentGame 변수 업데이트

    await message.channel.send({
      content: `${newGame} 내전이 생성되었습니다! 참여하려면 아래 버튼을 클릭하세요.`,
      components: [row],
    });
  },
};
