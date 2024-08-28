module.exports = {
  data: {
    name: "게임리스트",
  },
  async execute(message, args, gameList) {
    if (gameList.length === 0) {
      await message.channel.send("현재 생성된 게임이 없습니다.");
    } else {
      const gameListMessage = gameList.map((game, index) => `${index + 1}. ${game}`).join("\n");
      await message.channel.send(`현재 생성된 게임 목록:\n${gameListMessage}`);
    }
  },
};
