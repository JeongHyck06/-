module.exports = {
  data: {
    name: "팀섞기",
  },
  async execute(message, args, participants) {
    if (participants.length < 2) {
      return message.channel.send("참여자가 2명 이상이어야 팀을 나눌 수 있습니다.");
    }

    // 참가자를 섞고 두 팀으로 나눔
    const shuffled = participants.sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffled.length / 2);
    const team1 = shuffled.slice(0, half);
    const team2 = shuffled.slice(half);

    // 팀 결과 출력
    await message.channel.send(`**팀 1**\n${team1.join("\n")}\n\n**팀 2**\n${team2.join("\n")}`);
  },
};
