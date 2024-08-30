module.exports = {
    data: {
      name: "나가기",
    },
    async execute(message, args, getCurrentGame, participants) {
      const displayName = message.member.displayName;
  
      if (!getCurrentGame()) {
        return message.channel.send("현재 생성된 게임이 없습니다.");
      }
  
      const index = participants.indexOf(displayName);
      if (index !== -1) {
        participants.splice(index, 1);
        await message.channel.send(`${displayName}님이 게임에서 나갔습니다.`);
      } else {
        await message.channel.send(`${displayName}님은 게임에 참가하지 않았습니다.`);
      }
    },
  };
  