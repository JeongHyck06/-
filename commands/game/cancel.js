module.exports = {
  data: {
    name: "게임취소",
  },
  async execute(message, args, getCurrentGame, participants, setCurrentGame) {
    if (!getCurrentGame()) {
      return message.channel.send("취소할 게임 방이 없습니다.");
    }

    // currentGame 변수를 null로 설정하여 게임을 삭제
    setCurrentGame(null);

    // 참가자 목록 초기화
    participants.length = 0;

    await message.channel.send("게임 방이 취소되었습니다.");
  },
};
