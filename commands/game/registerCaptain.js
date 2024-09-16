const { getServerState } = require('../../state.js');

module.exports = {
    data: {
        name: '주장등록',
    },
    async execute(message, args) {
        const serverState = getServerState(message.guild.id);
        const displayName = message.member.displayName;

        if (!serverState.currentGame) {
            return message.channel.send('현재 생성된 게임이 없습니다.');
        }

        if (!serverState.participants.includes(displayName)) {
            return message.channel.send(`${displayName}님은 현재 게임에 참가하지 않았습니다.`);
        }

        const team = args[0]?.toLowerCase();
        if (!team || (team !== 'blue' && team !== 'red')) {
            return message.channel.send('주장 등록을 위해 팀을 지정해주세요. 예: `!주장등록 blue` 또는 `!주장등록 red`');
        }

        // 팀에 주장 등록
        if (team === 'blue') {
            serverState.teamBlueCaptain = displayName;
            serverState.teamBlue.push(displayName); // 주장 자동으로 팀에 배정
        } else if (team === 'red') {
            serverState.teamRedCaptain = displayName;
            serverState.teamRed.push(displayName); // 주장 자동으로 팀에 배정
        }

        await message.channel.send(`${displayName}님이 ${team.toUpperCase()} 팀의 주장으로 등록되었습니다.`);

        // 팀섞기 기능 비활성화
        serverState.teamShuffleLocked = true;
    },
};
