const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ChannelType } = require("discord.js");
const { token, prefix } = require("./config.json");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, // 음성 상태 감지에 필요한 인텐트 추가
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath).filter((folder) => fs.statSync(path.join(foldersPath, folder)).isDirectory());

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[경고] ${filePath} 파일의 명령어에 "data" 또는 "execute" 속성이 없습니다.`);
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`준비 완료! ${readyClient.user.tag}로 로그인되었습니다.`);
});

// 서버별 상태를 저장할 객체
const serverStates = {};

client.on(Events.MessageCreate, async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  const serverId = message.guild.id;

  // 해당 서버의 상태가 없으면 초기화
  if (!serverStates[serverId]) {
    serverStates[serverId] = {
      participants: [],
      currentGame: null,
      participantMessage: null,
      teamChannels: [], // 새로 생성된 음성 채널을 저장할 공간
    };
  }

  try {
    await command.execute(
      message,
      args,
      () => serverStates[serverId].currentGame,
      serverStates[serverId].participants,
      (newGame) => {
        serverStates[serverId].currentGame = newGame;
      },
      serverStates[serverId].teamChannels,
      (newChannels) => {
        serverStates[serverId].teamChannels = newChannels;
      }
    );
  } catch (error) {
    console.error(error);
    message.reply("명령어를 실행하는 동안 오류가 발생했습니다.");
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const serverId = interaction.guild.id;

  // 해당 서버의 상태가 없으면 초기화
  if (!serverStates[serverId]) {
    serverStates[serverId] = {
      participants: [],
      currentGame: null,
      participantMessage: null,
      teamChannels: [],
    };
  }

  const { participants, participantMessage } = serverStates[serverId];
  const displayName = interaction.member.displayName;

  if (interaction.customId === "join_game") {
    if (participants.includes(displayName)) {
      await interaction.reply({ content: "이미 참여하셨습니다!", ephemeral: true });
    } else {
      participants.push(displayName);

      const embed = new EmbedBuilder().setTitle("참여자 목록").setDescription(participants.join("\n")).setColor(0x00ae86);

      // 이전 임베드를 삭제하고 새로운 임베드를 보냄
      if (participantMessage) {
        await participantMessage.delete(); // 이전 임베드 삭제
      }

      // 새로운 임베드 메시지를 저장
      serverStates[serverId].participantMessage = await interaction.channel.send({ embeds: [embed] });

      await interaction.reply({ content: `${displayName}님이 내전에 참여하셨습니다!`, ephemeral: true });
    }
  }
});

client.login(token);
