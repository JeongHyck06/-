module.exports = {
  data: {
    name: "게임정보",
  },
  async execute(message, args, gameList, participants) {
    const userTag = message.author.tag;

    // 사용자가 참가한 게임이 있는지 확인
    if (!participants.includes(userTag)) {
      await message.channel.send(`${userTag}님은 현재 어떤 게임에도 참여하고 있지 않습니다.`);
      return;
    }

    // 참가자 정보를 보여줌
    if (participants.length === 0) {
      await message.channel.send("현재 이 게임 방에는 참가자가 없습니다.");
    } else {
      const participantList = participants.map((participant, index) => `${index + 1}. ${participant}`).join("\n");
      await message.channel.send(`현재 이 게임 방에 참가한 사람들:\n${participantList}`);
    }
  },
};
