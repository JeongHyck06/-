module.exports = {
  data: {
    name: "디버깅",
  },
  async execute(message, args, currentGame, participants) {
    console.log("디버깅 정보:");
    console.log("참가자 목록:", participants);
    console.log("현재 게임:", currentGame);

    await message.channel.send("디버깅 정보가 콘솔에 출력되었습니다.");
  },
};
