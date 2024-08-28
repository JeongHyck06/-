module.exports = {
  data: {
    name: "삭제",
  },
  async execute(message, args, gameList) {
    const gameNameToDelete = args.join(" ");

    if (!gameNameToDelete) {
      await message.channel.send("삭제할 게임 방 이름을 입력해주세요.");
      return;
    }

    const gameIndex = gameList.indexOf(gameNameToDelete);

    if (gameIndex === -1) {
      await message.channel.send(`"${gameNameToDelete}"이라는 이름의 게임 방을 찾을 수 없습니다.`);
    } else {
      gameList.splice(gameIndex, 1);
      await message.channel.send(`"${gameNameToDelete}" 게임 방이 삭제되었습니다.`);
    }
  },
};
