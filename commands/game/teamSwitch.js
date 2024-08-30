const { EmbedBuilder } = require("discord.js");
const { getServerState } = require('../../state.js');

module.exports = {
  data: {
    name: "팀이동",
  },
  async execute(message, args) {
    const serverState = getServerState(message.guild.id);
    const displayName = message.member.displayName;

    if (serverState.participants.length === 0) {
      return message.channel.send("참가자가 없습니다. 먼저 게임에 참가해주세요.");
    }

    if (!serverState.currentGame) {
      return message.channel.send("현재 생성된 게임이 없습니다.");
    }

    if (!args[0] || (args[0].toLowerCase() !== 'blue' && args[0].toLowerCase() !== 'red')) {
      return message.channel.send("이동할 팀을 지정해주세요. 예: `!팀이동 blue` 또는 `!팀이동 red`");
    }

    const teamName = args[0].toLowerCase();
    let teamSource, teamDestination;

    if (teamName === 'blue') {
      teamSource = serverState.teamRed;
      teamDestination = serverState.teamBlue;
    } else {
      teamSource = serverState.teamBlue;
      teamDestination = serverState.teamRed;
    }

    // 참가자가 원래 팀에 있는지 확인
    const index = teamSource.indexOf(displayName);
    if (index === -1 && teamDestination.includes(displayName)) {
      return message.channel.send(`${displayName}님은 이미 ${teamName.toUpperCase()} 팀에 있습니다.`);
    } else if (index === -1) {
      return message.channel.send(`${displayName}님은 현재 게임에 참가하지 않았습니다.`);
    }

    // 팀 이동
    teamSource.splice(index, 1); // 기존 팀에서 제거
    teamDestination.push(displayName); // 새로운 팀에 추가

    // 팀 이동 결과 출력
    await message.channel.send(`${displayName}님이 ${teamName.toUpperCase()} 팀으로 이동했습니다.`);

    // 팀 정보 업데이트 후 임베드 전송
    const teamBLUE = serverState.teamBlue.join("\n") || "없음";
    const teamRED = serverState.teamRed.join("\n") || "없음";

    const teamBlueEmbed = new EmbedBuilder().setTitle("BLUE").setColor(0x1abc9c).setDescription(teamBLUE);
    const teamRedEmbed = new EmbedBuilder().setTitle("RED").setColor(0xe74c3c).setDescription(teamRED);

    await message.channel.send({ embeds: [teamBlueEmbed, teamRedEmbed] });
  },
};
