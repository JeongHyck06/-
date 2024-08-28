module.exports = {
  data: {
    name: "게임나가기",
  },
  async execute(message, args, gameList, participants) {
    const userTag = message.author.tag;

    const index = participants.indexOf(userTag);

    if (index === -1) {
      await message.channel.send(`${userTag}님은 현재 참여 중인 게임이 없습니다.`);
    } else {
      participants.splice(index, 1);
      await message.channel.send(`${userTag}님이 게임에서 나갔습니다.`);
    }
  },
};
