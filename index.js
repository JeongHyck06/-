const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token, prefix } = require("./config.json");
const fs = require("fs");
const path = require("path");

// 새로운 클라이언트를 생성합니다.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // 메시지 콘텐츠를 읽을 수 있는 인텐트
  ],
});

// 명령어를 저장할 컬렉션을 생성합니다.
client.commands = new Collection();
let participants = []; // 참여자 목록을 저장하는 배열
let gameList = []; // 게임 목록을 저장하는 배열

// 명령어 폴더의 경로를 가져옵니다.
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath).filter((folder) => fs.statSync(path.join(foldersPath, folder)).isDirectory());

// 각 명령어 폴더를 순회하여 명령어 파일을 가져옵니다.
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  // 각 명령어 파일을 순회하여 컬렉션에 추가합니다.
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // 명령어 이름을 키로 하고, 모듈을 값으로 설정하여 컬렉션에 새 항목을 추가합니다.
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[경고] ${filePath} 파일의 명령어에 "data" 또는 "execute" 속성이 없습니다.`);
    }
  }
}

// 클라이언트가 준비되었을 때 실행됩니다 (한 번만).
client.once(Events.ClientReady, (readyClient) => {
  console.log(`준비 완료! ${readyClient.user.tag}로 로그인되었습니다.`);
});

// 메시지 이벤트 처리 (Prefix 명령어 처리)
client.on(Events.MessageCreate, async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    // 명령어에 게임 목록과 참여자 배열 전달
    command.execute(message, args, gameList, participants);
  } catch (error) {
    console.error(error);
    message.reply("명령어를 실행하는 동안 오류가 발생했습니다.");
  }
});

// 버튼 클릭 이벤트 처리
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "join_game") {
    const userTag = interaction.user.tag;

    if (participants.includes(userTag)) {
      await interaction.reply({ content: "이미 참여하셨습니다!", ephemeral: true });
    } else {
      participants.push(userTag);
      await interaction.reply({ content: `${userTag}님이 내전에 참여하셨습니다!`, ephemeral: true });
      await interaction.channel.send(`${userTag}님이 참여했습니다.`);
    }
  }
});

// 클라이언트의 토큰으로 Discord에 로그인합니다.
client.login(token);
