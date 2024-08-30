const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ChannelType } = require("discord.js");
const { token, prefix } = require("./config.json");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
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

client.on(Events.MessageCreate, async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("명령어를 실행하는 동안 오류가 발생했습니다.");
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const { getServerState } = require("./state.js");
  const serverState = getServerState(interaction.guild.id);

  const { participants, participantMessage } = serverState;
  const displayName = interaction.member.displayName;

  if (interaction.customId === "join_game") {
    if (participants.includes(displayName)) {
      await interaction.reply({ content: "이미 참여하셨습니다!", ephemeral: true });
    } else {
      participants.push(displayName);

      const embed = new EmbedBuilder().setTitle("참여자 목록").setDescription(participants.join("\n")).setColor(0x00ae86);

      if (participantMessage) {
        await participantMessage.delete();
      }

      serverState.participantMessage = await interaction.channel.send({ embeds: [embed] });

      await interaction.reply({ content: `${displayName}님이 내전에 참여하셨습니다!`, ephemeral: true });
    }
  }
});

client.login(token);
