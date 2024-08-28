module.exports = {
  data: {
    name: "팀섞기",
  },
  async execute(message, args, getCurrentGame, participants) {
    if (participants.length === 0) {
      return message.channel.send("참가자가 없습니다. 참가자들이 게임에 참가해야 합니다.");
    }

    // 참가자 배열을 섞습니다.
    const shuffledParticipants = participants.sort(() => Math.random() - 0.5);

    // 두 팀으로 나눕니다.
    const teamSize = Math.ceil(shuffledParticipants.length / 2);
    const team1 = shuffledParticipants.slice(0, teamSize);
    const team2 = shuffledParticipants.slice(teamSize);

    // 결과를 채널에 보냅니다.
    await message.channel.send(`팀 1: ${team1.join(", ")}`);
    await message.channel.send(`팀 2: ${team2.join(", ")}`);
  },
};
